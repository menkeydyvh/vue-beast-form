import { h, unref, reactive, resolveDynamicComponent, resolveDirective, withDirectives } from 'vue'
import { baseInject, vm, modelKeyAry } from './rule'
import type { VNodeTypes } from 'vue'
import type { RuleType } from '../types'
import { onToPropsName, propsToOnName } from '../tool'

export default class renderFactory {

    public rule: RuleType

    /**
     * 有v-model的时候这个值会有数据
     * todo:需要测试 v-model是对象和数组的情况是否正确
     */
    public field: string

    public props: any

    public children: Array<renderFactory | string> = []

    private _config: {
        modelKeys: string[]
        modelKeyEvents: string[]
        modelKeyDefaultValues: any[]
    }

    constructor(rule: RuleType) {
        this.rule = rule;

        this.initConfigCache()
        this.initProps()
        this.initChildre()
    }


    initConfigCache() {
        if (!baseInject.tagCacheComponents[this.rule.type]) {
            baseInject.tagCacheComponents[this.rule.type] = resolveDynamicComponent(this.rule.type)
        }

        let rdc = baseInject.tagCacheComponents[this.rule.type] as any

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

                this.field = this.rule.field
                modelKeyAry.push(this.field)
                this._config = {
                    modelKeys,
                    modelKeyEvents,
                    modelKeyDefaultValues
                }
            }

        }
    }

    initProps() {
        const tag = baseInject.tagCacheComponents[this.rule.type] as any,
            props = {
                ...this.rule.props,
                ...this.listenEvent(),
                disabled: unref(vm.props.disabled as boolean) === true || this.rule.props?.disabled === true
            }

        if (typeof tag === "string") {
            delete props.disabled
        } else {
            if (!Object.keys(tag.props).includes("disabled")) {
                delete props.disabled
            }
        }

        if (!(this.rule.title === false || !this.field)) {
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

        this.props = reactive(props)
    }

    initChildre() {
        if (this.rule.children) {
            this.rule.children.map(rule => {
                this.addChildren(rule)
            })
        }
    }

    // 底下是api相关

    /**
     * 修改值
     * @param value 
     * @param key 
    */
    setValue(value: any, key?: string) {
        if (!this.field) {
            return;
        }

        if (value === undefined) {
            // 设置默认空值
            if (this._config.modelKeys.length === 1) {
                this.props[this._config.modelKeys[0]] = this._config.modelKeyDefaultValues[0]
            } else if (this._config.modelKeys.length > 1) {
                if (key) {
                    const keyIndex = this._config.modelKeys.findIndex(mk => mk === key)
                    if (keyIndex > -1) {
                        this.props[key] = this._config.modelKeyDefaultValues[keyIndex]
                    }
                } else {
                    this._config.modelKeys.forEach(mk => {
                        this.setValue(value, mk)
                    })
                }
            }
        } else {
            // 正常设置值
            if (this._config.modelKeys.length === 1) {
                this.props[this._config.modelKeys[0]] = value
            } else if (this._config.modelKeys.length > 1) {
                if (key) {
                    if (this._config.modelKeys.includes(key)) {
                        this.props[key] = value
                    } else {
                        console.error(`undefined parameter "key=${key}"`)
                    }
                } else {
                    // todo:存在使用问题先不启用
                    // this._config.modelKeys.forEach(mk => {
                    //     this.setValue(value?.[mk], mk)
                    // })
                    console.error('Required parameter "key"')
                }
            }
        }
    }

    /**
     * 获取值
     * @param key 
     * @returns 
     */
    getValue(key?: string) {
        if (!this.field) {
            return;
        }

        if (this._config.modelKeys.length === 1) {
            return this.props[this._config.modelKeys[0]]
        } else if (this._config.modelKeys.length > 1) {
            if (key) {
                if (this._config.modelKeys.includes(key)) {
                    return this.props[key]
                }
            } else {
                const data = {};
                this._config.modelKeys.forEach(mk => {
                    data[mk] = this.getValue(mk)
                })
                return data
            }
        }
    }

    /**
     * 添加children
     * @param rule 
     * @param index 
     */
    addChildren(rule: RuleType | string, index?: number) {
        const startIndex = index === undefined || index === null ? this.children.length : index
        this.children.splice(startIndex, 0, typeof rule === "string" ? rule : new renderFactory(rule))
    }

    /**
     * 删除children
     * @param index 
     */
    delChildren(index?: number) {
        const endIndex = index === undefined || index === null ? this.children.length : 1
        this.children.splice(index, endIndex)
    }

    // 底下是渲染相关


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

        // 组件赋值事件处理
        if (this.field) {
            const props = {};
            self._config.modelKeys.forEach((key, index) => {
                props[key] = self._config.modelKeyDefaultValues[index]
                if (self.rule.props[key]) {
                    props[key] = self.rule.props[key]
                }
                if (self.rule.value != undefined) {
                    props[key] = self.rule.value
                }
                props[self._config.modelKeyEvents[index]] = function () {
                    self.setValue(arguments[0], key)
                    const onName = propsToOnName(self._config.modelKeyEvents[index]);
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
                baseInject.tagCacheComponents[this.rule.type] as any,
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
        if (!this.field) {
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
        if (this.props.disabled != true && this.rule.validate) {
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

        return h(baseInject.tagCacheComponents[config.defaultName.formItem] as any, props, slot)
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