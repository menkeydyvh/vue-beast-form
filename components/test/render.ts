import { h, resolveDynamicComponent } from 'vue'
import { baseInject } from './rule'
import type { VNodeTypes, DefineComponent } from 'vue'
import type { RuleType } from '../types'

export default class renderFactory {

    public rule: RuleType

    constructor(rule: RuleType) {
        this.rule = rule;
        this.initCache();
    }

    initCache() {
        if (!baseInject.tagCacheComponents[this.rule.type]) {
            const rdc: any = resolveDynamicComponent(this.rule.type)
            baseInject.tagCacheComponents[this.rule.type] = {
                component: rdc
            }
            if (typeof rdc === "object") {
                const config = baseInject.config, rdcName = rdc.name;
                let modelKeys: string[] = [], modelKeyEvents = [], modelKeyDefaultValues = [], rdcPropsKey = rdc.props ? Object.keys(rdc.props || {}) : [];

                if (this.rule.vModelKey) {
                    if (Array.isArray(this.rule.vModelKey)) {
                        modelKeys = this.rule.vModelKey
                    } else {
                        modelKeys.push(this.rule.vModelKey)
                    }
                }
                const confRdcKey = config.formDataComponentKey[rdcName]
                if (modelKeys.length === 0 && confRdcKey) {
                    if (Array.isArray(confRdcKey)) {
                        modelKeys = confRdcKey
                    } else {
                        modelKeys.push(confRdcKey)
                    }
                }

                if (modelKeys.length === 0) {
                    modelKeys.push(config.formDataComponentKey.default as string)
                }

                // 过滤验证 确认这个key在这个props里
                modelKeys = modelKeys.filter(item => rdcPropsKey.includes(item))
                if (modelKeys.length) {
                    const confRdcEvent = config.formDataComponentChangeKeyEvent[rdcName]
                    if (confRdcEvent) {
                        if (Array.isArray(confRdcEvent)) {
                            modelKeyEvents = confRdcEvent
                        } else {
                            modelKeyEvents.push(confRdcEvent)
                        }
                    }
                    if (modelKeyEvents.length === 0) {
                        modelKeyEvents = modelKeys.map(item => `onUpdate:${item}`)
                    }
                    const confRdcDValue = config.formDataComponentDefaultValue[rdcName]
                    if (confRdcDValue) {
                        if (Array.isArray(confRdcDValue)) {
                            modelKeyDefaultValues = confRdcDValue
                        } else {
                            modelKeyDefaultValues.push(confRdcDValue)
                        }
                    }
                    if (modelKeyDefaultValues.length === 0) {
                        modelKeyEvents = modelKeys.map(() => null)
                    }

                    baseInject.tagCacheComponents[this.rule.type].config = {
                        modelKeys,
                        modelKeyEvents,
                        modelKeyDefaultValues
                    }
                }

            }
        }
    }

    renderSolt() {
        const rcs = this.renderChildren()
        if (rcs) {
            const solt: {
                [key: string]: Array<VNodeTypes>
            } = {
                default: []
            }, result: {
                [key: string]: () => Array<VNodeTypes>
            } = {};
            rcs.forEach(rc => {
                if (typeof rc === "string") {
                    solt.default.push(rc)
                } else {
                    if (rc.rule.slot) {
                        if (!solt[rc.rule.slot]) {
                            solt[rc.rule.slot] = []
                        }
                        solt[rc.rule.slot].push(rc.render())
                    } else {
                        solt.default.push(rc.render())
                    }
                }
            })
            for (let key in solt) {
                result[key] = () => solt[key]
            }
            return result
        } else {
            return
        }
    }

    renderChildren() {
        if (this.rule.children) {
            return this.rule.children.map(rule => {
                if (typeof rule === "string") {
                    return rule;
                }
                return new renderFactory(rule)
            })
        }
        return;
    }

    renderRuleType() {
        return h(baseInject.tagCacheComponents[this.rule.type].component as DefineComponent, this.rule.props, this.renderSolt())
    }

    renderFormItem() {
        if (this.rule.title === false) {
            return
        }
        const tagConfig = baseInject.tagCacheComponents[this.rule.type]?.config
        if (!tagConfig) {
            return
        }
        const config = baseInject.config, props = { ...this.rule.attrs }, slot = {
            default: () => this.renderRuleType()
        };
        if (this.rule.class) {
            props.class = this.rule.class;
        }
        if (this.rule.style) {
            props.style = this.rule.style;
        }

        props[config.defaultName.formItemPropName] = this.rule.field
        if (this.rule.props.disabled != true && this.rule.validate) {
            if (this.rule.validate.find(item => item.required)) {
                props.required = true
            }
            props[config.defaultName.formItemPropRules] = this.rule.validate
        }
        if (typeof this.rule.title === 'string') {
            props[config.defaultName.formItemPropLabel] = this.rule.title;
        } else {
            const titleRender = new renderFactory(this.rule.title)
            slot[config.defaultName.formItemSlotTitle] = () => titleRender.render()
        }

        return h(baseInject.tagCacheComponents[config.defaultName.formItem].component as DefineComponent, props, slot)
    }

    render() {
        if (this.rule.display) return;

        return this.renderFormItem() || this.renderRuleType()
    }
}