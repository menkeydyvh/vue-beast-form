import { ref, reactive, toRefs, markRaw, resolveDynamicComponent, getCurrentInstance, provide, inject } from 'vue'
import { defineComponent, watch, onMounted, onBeforeUnmount, onUpdated } from 'vue'
import { formComponentConfig, formComponentValueChangeConfig, defaultName } from './config'
import { isObject, getArrayRule, updateRule, deepCopy } from './utils'
import { renderRule } from './render'
import type { PropType, ComponentInternalInstance, Component } from 'vue'
import type { RuleType, PropsOptionType, ApiFnType } from '../types/index'

const name: string = 'JsonLayout';

export default function factory() {

    const components: Record<string, Component> = {}

    /**
     * 加载组件
     * @param name 
     * @param component 
     */
    const component = (name: string, component: Component) => {
        components[name] = component
    }

    return defineComponent({
        name,
        component,
        components,
        props: {
            rule: { type: Array as PropType<Array<RuleType>>, required: true },
            modelValue: { default: null },
            option: { type: Object as PropType<PropsOptionType> },
            api: { type: Object as PropType<ApiFnType> },
            isForm: { type: Boolean, default: true },
            "onUpdate:api": { type: Function },
            "onUpdate:modelValue": { type: Function },
        },
        setup(props, { emit }) {
            const vm = getCurrentInstance(),
                { rule, option, modelValue, isForm } = toRefs(props),
                model = reactive<any>(modelValue.value ? modelValue.value : {}),
                nRule = ref<RuleType>({ type: 'div' }),
                // 设立resolveDynamicComponent缓存避免重复解析读取
                cacheResolveDynamicComponent = markRaw<any>({}),
                subFormVm = ref<ComponentInternalInstance[]>([]);

            // 记录子表单
            provide('subFormVm', subFormVm.value)

            // 获取注入的子表单
            const parentFrom = inject<ComponentInternalInstance[]>('subFormVm', null)

            // 规范化规则的模板
            const ruleTemplate = (config: RuleType): RuleType => {
                return {
                    showFormItem: isForm.value === true,
                    ...config,
                }
            }

            // 自动挂载组件
            if (vm.parent && vm.parent.components) {
                for (let componentName in vm.parent.components) {
                    components[componentName] = vm.parent.components[componentName]
                }
            } else {
                for (let name in components) {
                    delete components[name]
                }
            }

            // 获取对应得 v-model 的key和事件
            const getVModel = (type: string) => {
                if (!cacheResolveDynamicComponent[type]) {
                    cacheResolveDynamicComponent[type] = resolveDynamicComponent(type)
                }

                const rdcTag = cacheResolveDynamicComponent[type];

                if (isObject(rdcTag)) {
                    const modelKey = formComponentConfig[rdcTag.name] ? formComponentConfig[rdcTag.name] : formComponentConfig['default'],
                        propsKeys = rdcTag.props ? Object.keys(rdcTag.props || {}) : [],
                        onUpdateModelKey = formComponentValueChangeConfig[rdcTag.name] ? formComponentValueChangeConfig[rdcTag.name] : formComponentValueChangeConfig['default'];

                    if (propsKeys.includes(modelKey) && propsKeys.includes(onUpdateModelKey)) {
                        return {
                            modelKey,
                            onUpdateModelKey,
                            isSub: rdcTag.name === name,
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
                        gvmTag = getVModel(rtItem.type);

                    if (rtItem.children) {
                        rtItem.children = fillRuleChildren(rtItem.children as Array<RuleType>)
                    }

                    if (gvmTag) {
                        const { modelKey, onUpdateModelKey, isSub } = gvmTag;
                        rtItem.vModelKey = modelKey;

                        // 判断是表单组件
                        if (!rtItem.props) {
                            rtItem.props = {};
                        }


                        // 子json-layout组件
                        if (isSub && !rtItem.props.option) {
                            // rtItem.props.option = deepCopy(option.value)
                        }

                        // 赋值处理
                        if (item.field) {
                            model[item.field] = model[item.field] || item.value;
                            rtItem.props[modelKey] = model[item.field];
                            rtItem.props[onUpdateModelKey] = (value: any) => {
                                apiFn.setFieldChange(item.field || '', value);
                            }
                        }

                        if (rtItem.showFormItem) {

                            const result = ruleTemplate({
                                type: defaultName.formItem,
                                props: null
                            }), resultChildren = [];

                            // 显示form-item
                            const formItemProps: any = {};
                            formItemProps[defaultName.formItemPropName] = item.field
                            if (item.validate) {
                                if (Array.isArray(item.validate)) {
                                    if (item.validate.find(item => item.required)) {
                                        formItemProps.required = true
                                    }
                                }
                                formItemProps['rules'] = item.validate

                            }
                            if (typeof item.title === 'string') {
                                formItemProps[defaultName.formItemPropLabel] = item.title
                            }

                            result.props = formItemProps;
                            if (isObject(item.title)) {
                                resultChildren.push({
                                    ...item.title as RuleType,
                                    slot: defaultName.formItemSlotTitle
                                })
                            }
                            resultChildren.push(rtItem)
                            result.children = resultChildren;
                            return result
                        }

                    }
                    return rtItem;
                });
            }

            // 补足规则方便渲染处理
            const fillRule = () => {
                const baseRule = ruleTemplate({
                    type: '',
                }), rules = deepCopy(rule.value);

                if (isForm.value) {
                    let defaultOption = {};
                    const parent = getParent();
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

                baseRule.children = fillRuleChildren(rules);

                nRule.value = baseRule;
            }


            // api
            const apiFn: ApiFnType = {
                // 获取规则
                getRule(field, rules) {
                    rules = rules || nRule.value
                    let result = null
                    if (Array.isArray(rules)) {
                        result = getArrayRule(rules, field)
                    } else if (rules && rules.children) {
                        result = apiFn.getRule(field, rules.children as Array<RuleType>)
                    }
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
                setFieldChange(field, value) {
                    model[field] = value
                    const getRule = apiFn.getRule(field)
                    if (getRule) {
                        getRule.value = value
                        getRule.props[getRule.vModelKey] = value
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
                        apiFn.setFieldChange(key, modelValue.value[key])
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
            const getParent = (parent?: ComponentInternalInstance): ComponentInternalInstance => {
                if (!parent) {
                    parent = vm.parent
                }

                if (parent.type.name === name) {
                    return parent
                } else if (parent.uid === 1) {
                    return null;
                } else {
                    return getParent(parent.parent)
                }
            }

            // 初始化api
            const initApiFn = () => {
                emit('update:api', apiFn)
            }

            watch(model, () => {
                emit('update:modelValue', model)
            }, {
                deep: true
            })

            watch(isForm, () => {
                fillRule()
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

            fillRule();


            // 方便开发的时候查看
            return {
                nRule,
                subFormVm,
            }

            // return () => renderRule(nRule.value)
        },
        render() {
            return renderRule(this.nRule)
        }

    });

}
