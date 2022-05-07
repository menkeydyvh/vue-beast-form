import { ref, reactive, toRefs, markRaw, resolveDynamicComponent, getCurrentInstance, provide, inject } from 'vue'
import { defineComponent, watch, onMounted, onBeforeUnmount, onUpdated, computed } from 'vue'
import { formDataComponentKey, formDataComponentDefaultValue, formDataComponentChangeKeyEvent, defaultName } from './config'
import { isObject, loopRule, deepCopy, firstToUpper } from '../tool'
import { renderRule } from './render'
import type { PropType, ComponentInternalInstance } from 'vue'
import type { RuleType, PropsOptionType, ApiFnType } from '../types'

const name: string = 'JsonLayout';

export default function factory() {

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
                model = reactive<any>({ ...modelValue.value }),
                oldModel = markRaw<any>({ ...deepCopy(modelValue.value) }),
                nRule = computed(() => fillRule()),
                cacheResolveDynamicComponent = {},
                subFormVm = ref<ComponentInternalInstance[]>([]);

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
                if (typeof disabled.value === 'boolean') {
                    rt.props.disabled = disabled.value === true ? true : undefined;
                }

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
                    let defaultModelKey: string | string[] = vModelKey || formDataComponentKey[rdcTag.name] || formDataComponentKey['default'],
                        defaultEvents: any = null,
                        defaultValue: any = vModelKeyDefaultValue || null,
                        propsKeys = rdcTag.props ? Object.keys(rdcTag.props || {}) : [],
                        isBool = true;

                    // 默认先从配置中取
                    if (formDataComponentChangeKeyEvent[rdcTag.name]) {
                        defaultEvents = formDataComponentChangeKeyEvent[rdcTag.name]
                    }
                    if (formDataComponentDefaultValue[rdcTag.name]) {
                        defaultValue = formDataComponentDefaultValue[rdcTag.name]
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
                                        apiFn.setFieldValue(rtField, arguments[0], key);
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
                                    apiFn.setFieldValue(rtField, arguments[0]);
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
                }), rules = computed(() => deepCopy(rule.value));

                baseRule.children = fillRuleChildren(rules.value);

                if (isForm.value) {
                    let defaultOption = {};
                    if (baseFormVm) {
                        const baseOption = baseFormVm?.props?.option as PropsOptionType;
                        if (baseOption) {
                            defaultOption = deepCopy(baseOption.form)
                        }
                    }
                    const formProps = option.value ? deepCopy(option.value.form) : defaultOption;
                    formProps.model = model;
                    formProps.ref = 'form';
                    baseRule.type = defaultName.form
                    baseRule.props = formProps

                } else {
                    baseRule.type = 'div';
                }
                return baseRule;
            }


            // api
            const apiFn: ApiFnType = {
                // 设置数据
                setFieldValue(field, value, key) {
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
                // 设置titiel
                setTitle(field, value) {
                    const gRule = getRule(field);
                    if (gRule) {
                        gRule.title = value
                    }
                },
                // 设置 display
                display(field, display) {
                    const gRule = getRule(field);
                    if (gRule) {
                        gRule.display = display
                    }
                },
                // 设置 disabled
                disabled(field, isBool) {
                    let boolValue = isBool === true ? true : undefined
                    if (field) {
                        const gRule = getRule(field);
                        if (gRule) {
                            gRule.props.disabled = boolValue;
                        }
                    }
                },
                // 设置 children
                children(field, children) {
                    if (field) {
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
                    }
                },
                // 获取输入组件的值
                getFormData(field) {
                    return field ? model[field] : model
                },
                // 当前字段是否是model的key
                isModelKey(field) {
                    return Object.keys(model).includes(field)
                },
                // 表单验证，目前表单验证只负责主表单
                async validate(callback, fields) {
                    let valid = true
                    if (!await formValidate(vm.refs.form, fields)) {
                        valid = false
                    }
                    if (subFormVm.value && !fields) {
                        let i = 0, subFormLength = subFormVm.value.length;
                        for (i; i < subFormLength; i++) {
                            if (!await formValidate(subFormVm.value[i].refs.form)) {
                                valid = false
                            }
                        }
                    }
                    callback && callback(valid)
                },
                // 清除验证
                clearValidate(fields) {
                    clearFormValidate(vm.refs.form, fields);
                    if (subFormVm.value && !fields) {
                        subFormVm.value.forEach(item => {
                            clearFormValidate(item.refs.form);
                        })
                    }
                }
            }

            const changeModelValue = (isForce?: boolean) => {
                // modelValue变更的时候赋值
                for (let key in model) {
                    if (isForce || model[key] !== modelValue.value?.[key]) {
                        apiFn.setFieldValue(key, modelValue.value?.[key])
                    }
                }
            }, formValidate = async (formEvent: any, fields?: string | string[]) => {
                // 表单验证表单字段验证
                if (formEvent) {
                    try {
                        await formEvent.validate(fields)
                    } catch (error) {
                        return false;
                    }
                }
                return true;
            }, clearFormValidate = (formEvent: any, fields?: string | string[]) => {
                // 清除表单验证
                if (formEvent) {
                    formEvent.clearValidate(fields)
                }
            }, getRule = (field: string): RuleType => {
                // 获取规则 支持xxx.xxx方式
                let result = null, cacheAry = null;
                field.split('.').forEach((f, index) => {
                    if (index === 0) {
                        loopRule(nRule.value.children as Array<RuleType>, f, (item: RuleType, itemIndex: number, ruleAry: Array<RuleType>) => {
                            if (item) {
                                result = item;
                                cacheAry = ruleAry
                            }
                        })
                    } else if (cacheAry) {
                        loopRule(cacheAry, f, (item: RuleType, itemIndex: number, ruleAry: Array<RuleType>) => {
                            if (item) {
                                result = item;
                                cacheAry = ruleAry
                            } else {
                                result = null;
                                cacheAry = null;
                            }
                        })
                    }
                })
                return result
            }

            // 初始化
            const init = () => {
                emit('update:api', apiFn)
            }


            watch(model, () => {
                emit('update:modelValue', model)
            }, {
                deep: true
            })

            watch(modelValue, () => {
                changeModelValue();
            }, {
                deep: true
            })

            onMounted(() => {
                if (parentFrom) {
                    parentFrom.push(vm)
                }
                init()
            });

            onBeforeUnmount(() => {
                if (parentFrom) {
                    let idx = parentFrom.findIndex(item => item.uid === vm.uid)
                    if (idx > -1) {
                        parentFrom.splice(idx, 1)
                    }
                }
            })

            onUpdated(() => {
                init()
            })

            return () => renderRule(nRule.value)
        },


    });



}
