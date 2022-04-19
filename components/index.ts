import { defineComponent, ref, reactive, toRefs, toRaw, resolveDynamicComponent, watch, onMounted, VNodeTypes } from 'vue'
import { formComponentConfig, defaultName } from './config'
import { isObject, getArrayRule, updateRule } from './utils'
import { renderRule } from './render'
import { RuleType } from '../types/index'

const name: string = 'JsonLayout';

interface TypeModel {
    modelKey: string,
    onUpdateModelKey: string,
    propsKeys: Array<string>
};

export default defineComponent({
    name,
    props: {
        rule: {
            type: Array<RuleType>,
            required: true
        },
        modelValue: {
            type: Object
        },
        option: {
            type: Object
        },
        api: { type: Object },
        isForm: {
            type: Boolean,
            default: true
        }
    },
    emits: ['update:api', 'update:modelValue', 'submit'],
    setup(props, { emit }) {
        const { rule, option, modelValue, isForm } = toRefs(props),
            model = reactive<any>(modelValue.value ? modelValue.value : {}),
            nRule = ref<RuleType>({
                type: '',
                props: null,
                children: [],
                field: '',
                title: '',
                value: undefined,
                modelValueKey: '',
                validate: [],
                slot: ''
            });

        /**
         * 规范化规则的模板
         * @param {Rule} config 
         * @returns 
         */
        const ruleTemplate = (config: RuleType): RuleType => {
            const nodeRule: RuleType = {
                ...config,
            };

            return nodeRule
        }

        /**
         * 获取对应得 model 的value和事件
         * @param {*} type 
         */
        const getTypeModel = (type: string): TypeModel | null => {
            const rdcTag: any = resolveDynamicComponent(type);
            if (isObject(rdcTag)) {
                const modelKey = formComponentConfig[rdcTag.name] ? formComponentConfig[rdcTag.name] : formComponentConfig['default'],
                    onUpdateModelKey = `onUpdate:${modelKey}`,
                    propsKeys = Object.keys(rdcTag.props || {});

                return {
                    modelKey,
                    onUpdateModelKey,
                    propsKeys,
                }
            } else {
                return null
            }
        }

        /**
         * 补足渲染规则
         * @param {*} children 
         * @returns 
         */
        const fillRuleChildren = (children: Array<RuleType>): Array<RuleType> => {
            return children.map(item => {

                if (!isObject(item)) {
                    return item;
                }

                const rtItem: RuleType = ruleTemplate(item),
                    gtmTag = getTypeModel(rtItem.type);

                if (rtItem.children) {
                    rtItem.children = fillRuleChildren(rtItem.children)
                }

                if (gtmTag) {
                    const { modelKey, onUpdateModelKey, propsKeys } = gtmTag;
                    rtItem.modelValueKey = modelKey;

                    if (propsKeys.includes(modelKey) && propsKeys.includes(onUpdateModelKey)) {
                        // 判断是表单组件

                        // 赋值处理
                        model[item.field] = model[item.field] || item.value;
                        rtItem.props[modelKey] = model[item.field];
                        rtItem.props[onUpdateModelKey] = (value: any) => {
                            apiFn.setFieldChange(item.field, value);
                        }

                        if (rtItem.showFormItem) {
                            let result: RuleType;

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

                            const formItemRule: RuleType = {
                                type: defaultName.formItem,
                                props: formItemProps,
                                field: '',
                                children: [],
                                title: '',
                                value: undefined,
                                modelValueKey: '',
                                validate: [],
                                slot: ''
                            }
                            result = ruleTemplate(formItemRule)
                            if (isObject(item.title)) {
                                result.children.push({
                                    ...item.title as RuleType,
                                    slot: 'label'
                                })
                            }
                            result.children.push(rtItem)
                            return result
                        }

                    }
                }
                return rtItem;
            });
        }

        /**
         * 补足规则方便渲染处理
         */
        const fillRule = () => {
            const baseRule: RuleType = ruleTemplate({
                type: '',
                props: null,
                children: [],
                field: '',
                title: '',
                value: undefined,
                modelValueKey: '',
                validate: [],
                slot: ''
            });

            if (isForm.value) {
                const formProps = option.value ? toRaw(option.value.form) : {};
                formProps.model = model;
                formProps.onSubmit = () => {
                    emit('submit', model)
                };

                baseRule.title = defaultName.form
                baseRule.props = formProps

            } else {
                baseRule.title = 'div';
            }

            baseRule.children = fillRuleChildren(toRaw<Array<RuleType>>(rule.value));

            nRule.value = baseRule;
        }

        /**
         * api
         */
        const apiFn = {
            // 获取规则
            getRule(field: string, rules?: Array<RuleType> | RuleType): RuleType | null {
                rules = rules || nRule.value;
                let result = null;
                if (Array.isArray(rules)) {
                    result = getArrayRule(rules, field)
                } else if (rules && rules.children) {
                    result = apiFn.getRule(field, rules.children)
                }
                return result;
            },
            // 更新规则
            updateRule(field: string, rule: RuleType): void {
                if (rule && isObject(rule)) {
                    const getRule = apiFn.getRule(field);
                    updateRule(getRule, rule)
                }
            },
            // 设置数据
            setFieldChange(field: string, value: any): void {
                model[field] = value;
                const getRule = apiFn.getRule(field)
                if (getRule) {
                    getRule.value = value;
                    getRule.props[getRule.modelValueKey] = value;
                }
            }
        }

        watch(model, () => {
            emit('update:modelValue', model)
        }, {
            deep: true
        })

        watch(modelValue, () => {
            // console.log('modelValue:', modelValue.value)
        }, {
            deep: true
        })


        onMounted(() => {
            emit('update:api', apiFn)
        })

        fillRule();

        return () => renderRule(nRule.value)
    },



});