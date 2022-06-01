import { ref, reactive, toRefs, unref, resolveDynamicComponent, getCurrentInstance, provide, inject } from 'vue'
import { defineComponent, watch, onMounted, onBeforeUnmount, onUpdated, computed } from 'vue'
import { isObject, loopRule, deepCopy, firstToUpper } from '../tool'
import config from '../config'
import render from './render'
import type { PropType, ComponentInternalInstance } from 'vue'
import type { RuleType, PropsOptionType, ApiFnType } from '../types'

// TODO: 规则对象内置方法时候提供一个 JSON.stringify 和 JSON.parse 方法来处理对象是函数的处理
// TODO：补充element ui 和 iview ui的支持配置
// TODO：props.disabled 的修改不重绘整个组件？
// TODO：支持国际化

export default function factory() {

    const errorConfig = "You need set app.config.globalProperties.$jsonLayout",
        name = 'JsonLayout',
        baseFormRefs = 'form';

    return defineComponent({
        name,
        components: {},
        directives: {},
        props: {
            rule: { type: Array as PropType<Array<RuleType>>, required: true },
            modelValue: { default: null },
            option: { type: Object as PropType<PropsOptionType> },
            api: { type: Object as PropType<ApiFnType> },
            isForm: { type: Boolean, default: true },
            disabled: { type: Boolean },
            "onUpdate:api": { type: Function },
            "onUpdate:modelValue": { type: Function },
        },
        setup(props, { emit }) {
            const vm = getCurrentInstance(),
                { rule, option, modelValue, isForm, disabled } = toRefs(props),
                model = reactive({ ...modelValue.value }),
                oldModel = { ...deepCopy(modelValue.value) },
                cacheResolveDynamicComponent = {},
                subFormVm = ref<ComponentInternalInstance[]>([]);

            const conf = vm.appContext.config.globalProperties.$jsonLayout

            if (!conf) {
                console.error(errorConfig)
                return () => []
            }

            const baseConfig = new config(conf)

            const { renderRule } = new render(baseConfig)

            // 获取注入的父级信息
            const parentFrom = inject<ComponentInternalInstance[]>('subFormVm', null),
                baseFormVm = inject<ComponentInternalInstance>('baseFormVm', null)

            // 基础表单记录子表单或传递给子表单信息
            if (baseFormVm === null) {
                provide('baseFormVm', vm)
                provide('subFormVm', subFormVm.value)
            }

            // 规范化规则的模板
            const ruleTemplate = (config: RuleType): RuleType => {
                const rt = {
                    native: isForm.value === true,
                    ...config
                };

                if (!rt.props) {
                    rt.props = {}
                }

                rt.props.disabled = disabled.value;

                if (rt.on) {
                    for (let onName in rt.on) {
                        rt.props[`on${firstToUpper(onName)}`] = function () {
                            rt.on[onName](...arguments, apiFn)
                        }
                        rt.on[`on${firstToUpper(onName)}`] = function () {
                            rt.on[onName](...arguments, apiFn)
                        }
                    }
                }

                return reactive(rt)
            }

            // 获取对应得 v-model 的key和事件
            const getVModel = (type: string, vModelKey?: string | string[], vModelKeyDefaultValue?: any | any[]) => {
                if (!cacheResolveDynamicComponent[type]) {
                    cacheResolveDynamicComponent[type] = resolveDynamicComponent(type)
                }

                const rdcTag = cacheResolveDynamicComponent[type];

                if (isObject(rdcTag)) {
                    let defaultModelKey: string | string[] = vModelKey || baseConfig.formDataComponentKey[rdcTag.name] || baseConfig.formDataComponentKey['default'],
                        defaultEvents: any = null,
                        defaultValue: any = vModelKeyDefaultValue || null,
                        propsKeys = rdcTag.props ? Object.keys(rdcTag.props || {}) : [],
                        isBool = true;

                    // 默认先从配置中取
                    if (baseConfig.formDataComponentChangeKeyEvent[rdcTag.name]) {
                        defaultEvents = baseConfig.formDataComponentChangeKeyEvent[rdcTag.name]
                    }
                    if (baseConfig.formDataComponentDefaultValue[rdcTag.name]) {
                        defaultValue = baseConfig.formDataComponentDefaultValue[rdcTag.name]
                    }

                    if (Array.isArray(defaultModelKey)) {
                        if (!defaultEvents) {
                            defaultEvents = defaultModelKey.map(item => `onUpdate:${item}`)
                        }
                        if (!defaultValue) {
                            defaultValue = defaultModelKey.map(() => null)
                        }
                        defaultModelKey.forEach((key, itemIndex) => {
                            if (!propsKeys.includes(key) && propsKeys.includes(defaultEvents[itemIndex])) {
                                isBool = false
                            }
                        })
                    } else {
                        if (!defaultEvents) {
                            defaultEvents = `onUpdate:${defaultModelKey}`
                        }
                        if (!defaultValue) {
                            defaultValue = null
                        }
                        if (!(propsKeys.includes(defaultModelKey) && propsKeys.includes(defaultEvents))) {
                            isBool = false;
                        }
                    }

                    if (isBool) {
                        return {
                            modelKey: defaultModelKey,
                            onUpdateModelKey: defaultEvents,
                            defaultValue: defaultValue,
                        }
                    }
                }
                return null
            }

            // 补足渲染规则
            const fillRuleChildren = (children: Array<RuleType>): Array<RuleType> => {
                return children.map(item => {
                    if (!isObject(item)) {
                        return item;
                    }

                    const rtItem = ruleTemplate(item),
                        gvmTag = getVModel(rtItem.type, rtItem.vModelKey, rtItem.vModelKeyDefaultValue);

                    if (rtItem.children) {
                        rtItem.children = fillRuleChildren(rtItem.children as Array<RuleType>)
                    }

                    if (gvmTag) {
                        const { modelKey, onUpdateModelKey, defaultValue } = gvmTag, rtField = rtItem.field;
                        if (!rtItem.vModelKey) {
                            rtItem.vModelKey = modelKey;
                        }
                        // 赋值处理
                        if (rtField) {
                            let fieldValue: any = oldModel[rtField];
                            if (Array.isArray(modelKey)) {
                                if (!apiFn.isModelKey(rtField)) {
                                    model[rtField] = {}
                                }
                                if (!fieldValue) {
                                    fieldValue = {}
                                }
                                modelKey.forEach((key, keyIndex) => {
                                    if (!fieldValue[key]) {
                                        fieldValue[key] = rtItem.value?.[key] || defaultValue[keyIndex];
                                    }
                                    rtItem.props[key] = fieldValue[key];
                                    rtItem.props[onUpdateModelKey[keyIndex]] = function () {
                                        apiFn.setValue(rtField, arguments[0], key);
                                        if (rtItem.on?.[onUpdateModelKey[keyIndex]]) {
                                            rtItem.on[onUpdateModelKey[keyIndex]](...arguments)
                                        }
                                    }

                                    if (!Object.keys(model[rtField]).includes(key)) {
                                        model[rtField][key] = fieldValue[key]
                                    }
                                })

                            } else {
                                if (!fieldValue) {
                                    fieldValue = rtItem.value || defaultValue;
                                }
                                rtItem.props[modelKey] = fieldValue;

                                rtItem.props[onUpdateModelKey] = function () {
                                    apiFn.setValue(rtField, arguments[0]);
                                    if (rtItem.on?.[onUpdateModelKey]) {
                                        rtItem.on[onUpdateModelKey](...arguments)
                                    }
                                }

                                if (!apiFn.isModelKey(rtField)) {
                                    model[rtField] = fieldValue
                                }
                            }
                        }

                    } else {
                        rtItem.vModelKey = undefined;
                    }

                    // 处理事件

                    return rtItem;
                });
            }

            // 补足规则方便渲染处理
            const fillRule = () => {
                const baseRule = ruleTemplate({
                    type: '',
                });

                baseRule.children = fillRuleChildren(unref(rule));

                if (isForm.value) {
                    let defaultOption = {};
                    if (baseFormVm) {
                        const baseOption = baseFormVm?.props?.option as PropsOptionType;
                        if (baseOption) {
                            defaultOption = deepCopy(baseOption.form)
                        }
                    }
                    const formProps = option.value && option.value.form ? deepCopy(option.value.form) : defaultOption;
                    formProps.model = model;
                    formProps.ref = baseFormRefs;
                    baseRule.type = baseConfig.defaultName.form
                    baseRule.props = formProps

                } else {
                    baseRule.type = 'div';
                }

                return baseRule;
            }


            // api
            const apiFn: ApiFnType = {
                setValue(field, value, key) {
                    const gRule = getRule(field);
                    if (gRule && gRule.vModelKey) {
                        if (Array.isArray(gRule.vModelKey)) {
                            model[field][key] = value
                            gRule.props[key] = value
                        } else {
                            model[field] = value
                            gRule.props[gRule.vModelKey] = value
                        }
                    }
                },
                setTitle(field, value) {
                    const gRule = getRule(field);
                    if (gRule) {
                        gRule.title = value
                    }
                },
                setDisplay(field, display) {
                    const gRule = getRule(field);
                    if (gRule) {
                        gRule.display = display === true ? true : null
                    }
                },
                setDisabled(field, isBool) {
                    let boolValue = isBool === true ? true : undefined
                    if (field) {
                        const gRule = getRule(field);
                        if (gRule) {
                            gRule.props.disabled = boolValue;
                        }
                    }
                },
                setChildren(field, children) {
                    const gRule = getRule(field);
                    if (gRule) {
                        let ol = gRule.children.length,
                            nl = children ? children.length : 0;
                        if (Array.isArray(children)) {
                            children.forEach((item, index) => {
                                gRule.children[index] = item;
                            })
                        }
                        if (ol > nl) {
                            gRule.children.splice(nl, ol)
                        }
                    }
                },
                getFormData(field) {
                    return field ? model[field] : model
                },
                getProps(field) {
                    const gRule = getRule(field);
                    if (gRule) {
                        return gRule.props
                    }
                },
                clearValue(field) {
                    if (field) {
                        const gRule = getRule(field);
                        if (gRule) {
                            apiFn.setValue(field, gRule.vModelKeyDefaultValue);
                        }
                    } else {
                        for (let key in model) {
                            apiFn.clearValue(key)
                        }
                    }
                },
                isModelKey(field) {
                    return Object.keys(model).includes(field)
                },
                async validate(callback, fields) {
                    let valid = true
                    if (!await formValidate(vm.refs[baseFormRefs], fields)) {
                        valid = false
                    }
                    if (subFormVm.value && !fields) {
                        let i = 0, subFormLength = subFormVm.value.length;
                        for (i; i < subFormLength; i++) {
                            if (!await formValidate(subFormVm.value[i].refs[baseFormRefs])) {
                                valid = false
                            }
                        }
                    }
                    callback && callback(valid)
                },
                clearValidate(fields) {
                    clearFormValidate(vm.refs[baseFormRefs], fields);
                    if (subFormVm.value && !fields) {
                        subFormVm.value.forEach(item => {
                            clearFormValidate(item.refs[baseFormRefs]);
                        })
                    }
                }
            }

            const formValidate = async (formEvent: any, fields?: string | string[]) => {
                // 表单验证表单字段验证
                if (formEvent) {
                    try {
                        await formEvent[baseConfig.defaultName.formEventValidate](fields)
                    } catch (error) {
                        return false;
                    }
                }
                return true;
            }, clearFormValidate = (formEvent: any, fields?: string | string[]) => {
                // 清除表单验证
                if (formEvent) {
                    formEvent[baseConfig.defaultName.formEventClearValidate](fields)
                }
            }, getRule = (field: string): RuleType => {
                // 获取规则 支持xxx.xxx方式
                let result = null, cacheAry = null;
                if (field) {
                    field.split('.').forEach((f, index) => {
                        if (index === 0) {
                            loopRule(nRule.value.children as Array<RuleType>, f, ({ item, ruleAry }) => {
                                if (item) {
                                    result = item;
                                    cacheAry = ruleAry
                                }
                            })
                        } else if (cacheAry) {
                            loopRule(cacheAry, f, ({ item, ruleAry }) => {
                                if (item) {
                                    result = item;
                                    cacheAry = ruleAry
                                } else {
                                    result = null;
                                    cacheAry = null;
                                }
                            })
                        } else {
                            result = null;
                            cacheAry = null;
                        }
                    })
                }
                return result
            }

            // 初始化
            const init = () => {
                emit('update:api', apiFn)
            }

            onMounted(() => {
                if (parentFrom) {
                    parentFrom.push(vm)
                }
                init()
            });

            onUpdated(() => {
                init()
            })

            watch(model, () => {
                emit('update:modelValue', model)
            }, {
                deep: true
            })

            watch(() => modelValue.value, () => {
                for (let key in model) {
                    if (model[key] !== modelValue.value?.[key]) {
                        apiFn.setValue(key, modelValue.value?.[key])
                    }
                }
            }, {
                deep: true
            })

            onBeforeUnmount(() => {
                if (parentFrom) {
                    let idx = parentFrom.findIndex(item => item.uid === vm.uid)
                    if (idx > -1) {
                        parentFrom.splice(idx, 1)
                    }
                }
            })

            const nRule = computed(() => fillRule());

            return () => renderRule(nRule.value)
        },


    });

}
