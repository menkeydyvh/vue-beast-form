import { ref, reactive, toRefs, markRaw, resolveDynamicComponent, getCurrentInstance, provide, inject } from 'vue'
import { defineComponent, watch, onMounted, onBeforeUnmount, onUpdated, computed } from 'vue'
import { formComponentConfig, formComponentValueChangeConfig, defaultName } from './config'
import { isObject, getParentCompnent, loopRule, updateRule, deepCopy } from '../tool'
import { renderRule } from './render'
import type { PropType, ComponentInternalInstance } from 'vue'
import type { RuleType, PropsOptionType, ApiFnType } from '../types'

const name: string = 'JsonLayout';

export default function factory() {

    return defineComponent({
        name,
        components: {},
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
                nRule = computed(() => fillRule()),
                cacheResolveDynamicComponent = markRaw<any>({}),
                subFormVm = ref<ComponentInternalInstance[]>([]);

            // 记录子表单
            provide('subFormVm', subFormVm.value)

            // 获取注入的子表单
            const parentFrom = inject<ComponentInternalInstance[]>('subFormVm', null)

            // 规范化规则的模板
            const ruleTemplate = (config: RuleType): RuleType => {
                const rt = {
                    native: isForm.value === true,
                    ...config,
                }
                if (!rt.props) {
                    rt.props = {}
                }
                if (typeof disabled.value === 'boolean') {
                    rt.props.disabled = disabled.value === true ? true : undefined;
                }
                return reactive(rt)
            }

            // 获取对应得 v-model 的key和事件
            const getVModel = (type: string, vModelKey?: string | string[]) => {
                if (!cacheResolveDynamicComponent[type]) {
                    cacheResolveDynamicComponent[type] = resolveDynamicComponent(type)
                }

                const rdcTag = cacheResolveDynamicComponent[type];

                if (isObject(rdcTag)) {
                    if (Array.isArray(vModelKey)) {
                        const propsKeys = rdcTag.props ? Object.keys(rdcTag.props || {}) : [];
                        let modelKey = [], onUpdateModelKey = [];
                        vModelKey.forEach(key => {
                            if (propsKeys.includes(key) && propsKeys.includes(`onUpdate:${key}`)) {
                                modelKey.push(key)
                                onUpdateModelKey.push(`onUpdate:${key}`);
                            }
                        })

                        if (modelKey.length) {
                            return {
                                modelKey,
                                onUpdateModelKey,
                            }
                        }
                    } else if (vModelKey) {
                        const modelKey = vModelKey,
                            propsKeys = rdcTag.props ? Object.keys(rdcTag.props || {}) : [],
                            onUpdateModelKey = `onUpdate:${vModelKey}`;

                        if (propsKeys.includes(modelKey) && propsKeys.includes(onUpdateModelKey)) {
                            return {
                                modelKey,
                                onUpdateModelKey,
                            }
                        }
                    } else {
                        const modelKey = formComponentConfig[rdcTag.name] ? formComponentConfig[rdcTag.name] : formComponentConfig['default'],
                            propsKeys = rdcTag.props ? Object.keys(rdcTag.props || {}) : [],
                            onUpdateModelKey = formComponentValueChangeConfig[rdcTag.name] ? formComponentValueChangeConfig[rdcTag.name] : formComponentValueChangeConfig['default'];

                        if (propsKeys.includes(modelKey) && propsKeys.includes(onUpdateModelKey)) {
                            return {
                                modelKey,
                                onUpdateModelKey,
                            }
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
                        gvmTag = getVModel(rtItem.type, rtItem.vModelKey);

                    if (rtItem.children) {
                        rtItem.children = fillRuleChildren(rtItem.children as Array<RuleType>)
                    }

                    if (gvmTag) {
                        const { modelKey, onUpdateModelKey } = gvmTag, rtField = rtItem.field;
                        if (!rtItem.vModelKey) {
                            rtItem.vModelKey = modelKey;
                        }
                        // 赋值处理
                        if (rtField) {
                            if (!apiFn.isModelKey(rtField)) {
                                if (Array.isArray(modelKey)) {
                                    const json = {};
                                    modelKey.forEach(key => {
                                        json[key] = item.value ? item.value[key] : undefined;
                                    })
                                    model[rtField] = json;
                                } else {
                                    model[rtField] = item.value;
                                }
                            }
                            if (Array.isArray(modelKey)) {
                                modelKey.forEach((key, keyIndex) => {
                                    rtItem.props[key] = model[rtField] ? model[rtField][key] : undefined;
                                    rtItem.props[onUpdateModelKey[keyIndex]] = (value: any) => {
                                        apiFn.setFieldValue(rtField, value, key);
                                    }
                                })
                            } else {
                                rtItem.props[modelKey] = model[rtField];
                                rtItem.props[onUpdateModelKey] = (value: any) => {
                                    apiFn.setFieldValue(rtField, value);
                                }
                            }
                        }

                    } else {
                        rtItem.vModelKey = undefined;
                    }

                    return rtItem;
                });
            }

            // 补足规则方便渲染处理
            const fillRule = () => {
                const baseRule = ruleTemplate({
                    type: '',
                }), rules = computed(() => deepCopy(rule.value));

                if (isForm.value) {
                    let defaultOption = {};
                    const parent = getParentCompnent(vm.parent, name);
                    if (parent) {
                        const parentOption = parent.props.option as PropsOptionType;
                        if (parentOption) {
                            defaultOption = deepCopy(parentOption.form)
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

                baseRule.children = fillRuleChildren(rules.value);

                return baseRule;
            }


            // api
            const apiFn: ApiFnType = {
                // 获取规则
                getRule(field) {
                    let result = null
                    loopRule(nRule.value.children as Array<RuleType>, field, (item: RuleType) => {
                        result = item
                    })
                    return result
                },
                // 覆盖规则
                updateRule(field, rule, isMerge) {
                    if (rule && isObject(rule)) {
                        const getRule = apiFn.getRule(field)
                        updateRule(getRule, rule, isMerge)
                    }
                },
                // 设置数据
                setFieldValue(field, value, key) {
                    const getRule = apiFn.getRule(field);
                    if (getRule) {
                        debugger
                        if (Array.isArray(getRule.vModelKey)) {
                            if (model[field]) {
                                model[field][key] = value
                            } else {
                                const json = {};
                                json[key] = value;
                                model[field][key] = json
                            }
                        } else {
                            model[field] = value
                        }
                    }
                    console.log(getRule)
                },
                // 设置 display
                display(field, display) {
                    const getRule = apiFn.getRule(field);
                    if (getRule) {
                        getRule.display = display
                    }
                },
                // 设置 disabled
                disabled(field, isBool) {
                    let boolValue = isBool === true ? true : undefined
                    if (field) {
                        const getRule = apiFn.getRule(field);
                        if (getRule) {
                            getRule.props.disabled = boolValue;
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
            }

            // modelValue变更的时候赋值
            const changeModelValue = () => {
                for (let key in model) {
                    if (model[key] !== modelValue.value[key]) {
                        apiFn.setFieldValue(key, modelValue.value[key])
                    }
                }
            }

            // 表单验证表单字段验证
            const formValidate = async (formEvent: any, fields?: string | string[]) => {
                if (formEvent) {
                    try {
                        await formEvent.validate(fields)
                    } catch (error) {
                        return false;
                    }
                }
                return true;
            }

            // 初始化api
            const initApiFn = () => {
                emit('update:api', apiFn)
            }


            watch(() => model, () => {
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
                initApiFn()
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
                initApiFn()
            })

            return () => renderRule(nRule.value)
        },


    });



}
