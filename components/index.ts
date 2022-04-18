import { defineComponent, ref, reactive, toRefs, toRaw, resolveDynamicComponent, watch, onMounted } from 'vue'
import { formComponentConfig, defaultName } from './config'
import { isObject, getArrayRule } from './utils'
import { renderRule } from './render'
import { Rule } from '../types/index'

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
            type: Array<Rule>,
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
            model = reactive<object>(modelValue.value ? modelValue.value : {}),
            nRule = ref<Rule>();

        /**
         * 规范化规则的模板
         * @param {Rule} config 
         * @returns 
         */
        const ruleTemplate = (config: Rule): Rule => {
            const nodeRule: Rule = {
                // 必须
                type: undefined,
                // 表单输入组件时是必须，其他时候填写方便查找调整规则
                field: undefined,
                // 组件相关
                props: undefined,
                value: undefined,
                modelValueKey: undefined,
                // form-item
                validate: undefined,
                title: undefined,
                // 布局相关
                showFormItem: isForm.value,
                children: undefined,
                slot: undefined,
                ...config,
            };

            return nodeRule
        }

        /**
         * 获取对应得 model 的value和事件
         * @param {*} type 
         */
        const getTypeModel = (type: string): TypeModel => {
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
        const fillRuleChildren = (children: Array<Rule>): Array<Rule> => {
            return children.map(item => {

                if (!isObject(item)) {
                    return item;
                }

                let result: Rule;
                const rtItem: Rule = ruleTemplate(item),
                    gtmTag: TypeModel = getTypeModel(rtItem.type);

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
                            result = ruleTemplate({
                                type: defaultName.formItem,
                                props: formItemProps,
                                children: []
                            })
                            if (isObject(item.title)) {
                                result.children.push({
                                    ...item.title as Rule,
                                    slot: 'label'
                                })
                            }
                            result.children.push(rtItem)
                        }

                    }
                }
                return result ? result : rtItem;
            });
        }

        /**
         * 补足规则方便渲染处理
         */
        const fillRule = (): Rule => {
            let baseRule: Rule;
            if (isForm.value) {
                const formProps = option.value ? toRaw(option.value.form) : {};
                formProps.model = model;
                formProps.onSubmit = () => {
                    emit('submit', model)
                };

                baseRule = ruleTemplate({
                    type: defaultName.form,
                    props: formProps,
                    children: []
                })
            } else {
                baseRule = ruleTemplate({
                    type: "div",
                    children: []
                })
            }

            baseRule.children = fillRuleChildren(toRaw(rule.value));

            return baseRule;
        }

        /**
         * api
         */
        const apiFn = {
            // 获取规则
            getRule(field: string, rules?: Array<Rule> | Rule): Rule {
                rules = rules || nRule.value;
                let result: Rule;
                if (Array.isArray(rules)) {
                    result = getArrayRule(rules, field)
                } else if (rules && rules.children) {
                    result = apiFn.getRule(field, rules.children)
                }
                return result;
            },
            // 更新规则
            updateRule(field: string, rule: Rule): void {
                if (rule && isObject(rule)) {
                    const getRule: Rule = apiFn.getRule(field)
                    if (getRule) {
                        for (let key in rule) {
                            getRule[key] = rule[key]
                        }
                    }
                }
            },
            // 设置数据
            setFieldChange(field: string, value: any): void {
                model[field] = value;
                const getRule: Rule = apiFn.getRule(field)
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

        nRule.value = fillRule();

        return () => renderRule(nRule.value)
    },



});