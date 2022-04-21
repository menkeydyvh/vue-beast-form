import { defineComponent, ref, reactive, toRefs, toRaw, markRaw, resolveDynamicComponent, watch, onMounted, PropType } from 'vue'
import { formComponentConfig, formComponentValueChangeConfig, defaultName } from './config'
import { isObject, getArrayRule, updateRule, deepCopy } from './utils'
import { renderRule } from './render'
import { RuleType, PropsOptionType } from '../types/index'

const name: string = 'JsonLayout';

export default defineComponent({
    name,
    props: {
        rule: { type: Array as PropType<Array<RuleType>>, required: true },
        modelValue: { type: Object },
        option: { type: Object as PropType<PropsOptionType> },
        api: { type: Object },
        isForm: { type: Boolean, default: true }
    },
    emits: ['update:api', 'update:modelValue', 'submit'],
    setup(props, { emit }) {
        const { rule, option, modelValue, isForm } = toRefs(props),
            model = reactive<any>(modelValue.value ? modelValue.value : {}),
            nRule = ref<RuleType>({ type: 'div' }),
            // 设立resolveDynamicComponent缓存避免重复解析读取
            cacheResolveDynamicComponent = markRaw<any>({});

        // 规范化规则的模板
        const ruleTemplate = (config: RuleType): RuleType => {
            return {
                showFormItem: isForm.value === true,
                ...config,
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
                    const { modelKey, onUpdateModelKey } = gvmTag;
                    rtItem.vModelKey = modelKey;

                    // 判断是表单组件
                    if (!rtItem.props) {
                        rtItem.props = {};
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
                const formProps = option.value ? toRaw(option.value.form) : {};
                formProps.model = model;
                formProps.onSubmit = () => {
                    emit('submit', model)
                };
                baseRule.type = defaultName.form
                baseRule.props = formProps

            } else {
                baseRule.type = 'div';
            }

            baseRule.children = fillRuleChildren(rules);

            nRule.value = baseRule;
            console.log(baseRule)
        }

        // api
        const apiFn = {
            // 获取规则
            getRule(field: string, rules?: Array<RuleType> | RuleType): RuleType | null {
                rules = rules || nRule.value;
                let result = null;
                if (Array.isArray(rules)) {
                    result = getArrayRule(rules, field)
                } else if (rules && rules.children) {
                    result = apiFn.getRule(field, rules.children as Array<RuleType>)
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
                    getRule.props[getRule.vModelKey] = value;
                }
            }
        }

        // modelValue变更的时候赋值
        const changeModelValue = () => {
            for (let key in model) {
                if (model[key] !== modelValue.value[key]) {
                    apiFn.setFieldChange(key, modelValue.value[key])
                }
            }
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
            emit('update:api', apiFn)
        })

        fillRule();

        return () => renderRule(nRule.value)
    },
});