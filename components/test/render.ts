import { h, resolveDynamicComponent, resolveDirective, withDirectives } from 'vue'
import { baseInject, model, vm } from './rule'
import type { VNodeTypes } from 'vue'
import type { RuleType } from '../types'
import { onToPropsName, propsToOnName } from '../tool'

export default class renderFactory {

    public rule: RuleType

    public props: any

    public children: Array<renderFactory | string>

    constructor(rule: RuleType) {
        this.rule = rule;

        this.initCache()
        this.initProps()
        this.initChildre()
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
                        modelKeyDefaultValues = modelKeys.map(() => null)
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

    initProps() {
        const tag: any = baseInject.tagCacheComponents[this.rule.type].component,
            tagConfig = baseInject.tagCacheComponents[this.rule.type]?.config,
            props = { ...this.rule.props, ...this.listenEvent() }

        if (typeof tag === "string") {
            delete props.disabled
        } else {
            if (!Object.keys(tag.props).includes("disabled")) {
                delete props.disabled
            }
        }

        if (!(this.rule.title === false || !tagConfig)) {
            if (this.rule.attrs) {
                for (let key in this.rule.attrs) {
                    props[key] = this.rule.attrs[key]
                }
            }
            if (this.rule.style) {
                props.style = this.rule.style
            }
            if (this.rule.class) {
                props.class = this.rule.class
            }
        }

        this.props = props
    }

    initChildre() {
        if (this.rule.children) {
            this.children = this.rule.children.map(rule => {
                if (typeof rule === "string") {
                    return rule;
                }
                return new renderFactory(rule)
            })
        }
    }

    /**
     * 处理规则on和emits上的事件
     * @returns 
     */
    listenRuleOnAndEmits() {
        const self = this, props = {}, listens: {
            source: "on" | "emits"
            event: string
        }[] = [];

        if (this.rule?.emits) {
            this.rule.emits.forEach(item => {
                listens.push({
                    source: "emits",
                    event: item.event
                });
            })
        }

        if (this.rule?.on) {
            for (let onName in this.rule.on) {
                if (!listens.find(item => item.event === onName)) {
                    listens.push(
                        {
                            source: "on",
                            event: onName,
                        }
                    )
                }
            }
        }

        listens.forEach(item => {
            props[onToPropsName(item.event)] = function () {
                if (item.source === "on") {
                    self.rule.on[item.event](...arguments, baseInject.api)
                } else if (item.source === "emits") {
                    const emitItem = self.rule.emits.find(emit => emit.event === item.event)
                    vm.emit(emitItem.alias, ...arguments, baseInject.api)
                }
            }
        })
        if (Object.keys(props).length) {
            return props
        }
    }

    /**
     * 处理 v-model 的事件
     * @returns 
     */
    listenModelEvent() {
        const self = this;
        const tagConfig = baseInject.tagCacheComponents[this.rule.type]?.config

        // 组件赋值事件处理
        if (tagConfig) {
            const props = {}, isOne = tagConfig.modelKeys.length === 1
            // todo:记得处理当值存在 对象和数组的情况需要检测一下是否正确
            tagConfig.modelKeys.forEach((key, index) => {
                props[key] = tagConfig.modelKeyDefaultValues[index]
                if (self.rule.props[key]) {
                    props[key] = self.rule.props[key]
                }
                if (self.rule.value != undefined) {
                    props[key] = self.rule.value
                }
                if (isOne) {
                    if (model[self.rule.field] != undefined) {
                        props[key] = model[self.rule.field]
                    }
                } else {
                    if (model[self.rule.field]?.[key] != undefined) {
                        props[key] = model[self.rule.field][key]
                    }
                }
                props[tagConfig.modelKeyEvents[index]] = function () {
                    const value = arguments[0];
                    if (isOne) {
                        model[self.rule.field] = value
                    } else {
                        if (!model[self.rule.field]) {
                            model[self.rule.field] = {
                                [key]: value
                            }
                        } else {
                            model[self.rule.field][key] = value
                        }
                    }
                    const onName = propsToOnName(tagConfig.modelKeyEvents[index]);
                    if (self.rule?.on?.[onName]) {
                        self.rule.on[onName](...arguments, baseInject.api)
                    }
                    if (self.rule?.emits) {
                        const emitItem = self.rule.emits.find(item => item.event === onName)
                        if (emitItem) {
                            vm.emit(emitItem.alias, ...arguments, baseInject.api)
                        }
                    }
                }

                if (model[self.rule.field] === undefined) {
                    model[self.rule.field] = props[key]
                }

            })
            if (Object.keys(props).length) {
                return props
            }
        }
        return;
    }

    /**
     * 事件处理集合
     * @returns 
     */
    listenEvent() {
        return {
            ...this.listenRuleOnAndEmits(),
            ...this.listenModelEvent()
        }
    }

    /**
     * 插槽渲染children
     * @returns 
     */
    renderChildrenSolt() {
        const rcs = this.children
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


    /**
     * 渲染指令
     * @param vNode 
     * @returns 
     */
    renderDirectives(vNode: VNodeTypes) {
        if (this.rule.directives) {
            const directives = this.rule.directives.map(item => {
                if (Array.isArray(item)) {
                    if (typeof item[0] === 'string') {
                        item[0] = resolveDirective(item[0])
                    }
                    return item
                }
            }).filter(item => item)
            return withDirectives(vNode as any, directives as any)
        } else {
            return vNode
        }
    }

    /**
     * 渲染type
     * @returns 
     */
    renderType() {
        return this.renderDirectives(
            h(
                baseInject.tagCacheComponents[this.rule.type].component as any,
                this.props,
                this.renderChildrenSolt()
            )
        )
    }

    /**
     * 渲染title
     * @returns 
     */
    renderTitle() {
        if (this.rule.title === false) {
            return;
        }
        if (typeof this.rule.title === "string") {
            return;
        }
        const titleRender = new renderFactory(this.rule.title)
        return titleRender.render()
    }

    /**
     * 渲染formItem
     * @returns 
     */
    renderFormItem() {
        if (!baseInject.tagCacheComponents[this.rule.type]?.config) {
            return
        }
        if (this.rule.title === false) {
            return
        }
        const config = baseInject.config, props = { ...this.rule.attrs }, slot = {
            default: () => this.renderType()
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
            slot[config.defaultName.formItemSlotTitle] = () => this.renderTitle()
        }

        return h(baseInject.tagCacheComponents[config.defaultName.formItem].component as any, props, slot)
    }

    /**
     * 渲染
     * @returns 
     */
    render() {
        if (this.rule.display) return;
        return this.renderFormItem() || this.renderType()
    }
}