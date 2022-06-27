import { h, unref, reactive, resolveDynamicComponent, resolveDirective, withDirectives } from 'vue'
import { baseInject, vm, modelValue, FormFactory } from './form'
import type { VNodeTypes } from 'vue'
import type { RuleType, EmitType } from '../types'
import { onToPropsName, propsToOnName } from '../tool'
import { deepCopy } from '../tool'

export class RuleFactory {

    public rule: RuleType

    /**
     * 有v-model的时候这个值会有数据
     * todo:需要测试 v-model是对象和数组的情况是否正确
     */
    public field: string

    public props: any

    public display: boolean

    public children: Array<RuleFactory | string> = []

    private _config: {
        modelKeys: string[]
        modelKeyEvents: string[]
        modelKeyDefaultValues: any[]
    }

    static onChangeField: (field: string, value: any) => void

    constructor(rule: RuleType) {
        this.rule = rule;

        this.display = this.rule.display

        this.initConfigCache()
        this.initProps()
        this.initValue()
        this.listenEvent()
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

                this._config = {
                    modelKeys,
                    modelKeyEvents,
                    modelKeyDefaultValues
                }


            }

        }
    }

    initValue() {
        if (!this.field) {
            return
        }

        let data: any
        if (this._config.modelKeys.length === 1) {
            if (modelValue?.[this.field] !== undefined) {
                data = modelValue[this.field]
            } else if (this.rule?.value !== undefined) {
                data = this.rule.value
            } else if (this.rule?.props?.[this._config.modelKeys[0]] !== undefined) {
                data = this.rule.props[this._config.modelKeys[0]]
            } else {
                data = this._config.modelKeyDefaultValues[0];
            }
            if (typeof data === 'object') {
                data = deepCopy(data);
            }
            this.props[this._config.modelKeys[0]] = data
        } else {
            data = {}
            this._config.modelKeys.forEach((key, keyIdx) => {
                if (modelValue?.[this.field]?.[key] !== undefined) {
                    data = modelValue[this.field][key]
                } else if (this.rule?.value !== undefined) {
                    data[key] = this.rule.value[key]
                } else if (this.rule?.props?.[key] !== undefined) {
                    data[key] = this.rule.props[key]
                } else {
                    data[key] = this._config.modelKeyDefaultValues[keyIdx];
                }
                if (typeof data[key] === 'object') {
                    data[key] = deepCopy(data[key]);
                }
                this.props[key] = data[key]
            })
        }

        if (!Object.keys(modelValue).includes(this.field)) {
            modelValue[this.field] = data
        }
    }

    initProps() {
        const tag = baseInject.tagCacheComponents[this.rule.type] as any,
            props = {
                ...this.rule.props,
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
        if (this.rule.children && this.rule.children.length) {
            this.rule.children.map(rule => {
                this.addChildren(rule)
            })
        }
    }

    // 底下是api相关

    /**
     * 修改值
     * @param v 
     * @param key 
    */
    setValue(v: any, key?: string) {
        if (!this.field) {
            return;
        }
        // 正常设置值
        if (this._config.modelKeys.length === 1) {
            this.props[this._config.modelKeys[0]] = v === undefined ? this._config.modelKeyDefaultValues[0] : v
        } else {
            if (key) {
                const keyIdx = this._config.modelKeys.findIndex(mk => mk === key)
                if (keyIdx > -1) {
                    this.props[key] = v === undefined ? this._config.modelKeyDefaultValues[keyIdx] : v
                }
            } else {
                this._config.modelKeys.forEach((mk, keyIdx) => {
                    this.props[mk] = v?.[mk] === undefined ? this._config.modelKeyDefaultValues[keyIdx] : v?.[mk]
                })
            }
        }

        modelValue[this.field] = this.getValue()
        if (RuleFactory.onChangeField) {
            RuleFactory.onChangeField(this.field, this.getValue())
        }
    }

    getValue(key?: string) {
        if (!this.field) {
            return;
        }
        if (this._config.modelKeys.length === 1) {
            return this.props[this._config.modelKeys[0]]
        } else {
            if (key) {
                const keyIdx = this._config.modelKeys.findIndex(mk => mk === key)
                if (keyIdx > -1) {
                    return this.props[key]
                }
            } else {
                const data = {}
                this._config.modelKeys.forEach((mk) => {
                    data[mk] = this.props[mk]
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
        this.children.splice(startIndex, 0, typeof rule === "string" ? rule : new RuleFactory(rule))
    }

    /**
     * 删除children
     * @param index 
     */
    delChildren(index?: number) {
        const endIndex = index === undefined || index === null ? this.children.length : 1
        this.children.splice(index, endIndex)
    }

    /**
     * 添加事件
     * @param event 
     * @param callback 
     */
    addOn(event: string, callback?: Function) {
        const self = this;
        this.props[onToPropsName(event)] = function () {
            if (callback) {
                callback(...arguments, FormFactory.api)
            } else {
                self.rule.on[event](...arguments, FormFactory.api)
            }
        }
    }

    /**
     * 添加emit
     * @param eType 
     */
    addEmit(eType: EmitType) {
        if (eType) {
            this.props[onToPropsName(eType.event)] = function () {
                vm.emit(eType.alias, ...arguments, FormFactory.api)
            }
        }
    }

    /**
    * 删除事件
    * @param event 
    */
    delOnOrEmit(event: string) {
        let propsEventName = onToPropsName(event)
        if (typeof this.props[propsEventName] === 'function') {
            delete this.props[propsEventName]
        }
    }

    // 底下是渲染相关


    /**
     * 处理规则on和emits上的事件
     * @returns 
     */
    listenRuleOnAndEmits() {
        const self = this, listens: {
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
            if (item.source === "on") {
                this.addOn(item.event)
            } else if (item.source === "emits") {
                const emitItem = self.rule.emits.find(emit => emit.event === item.event)
                this.addEmit(emitItem)
            }
        })
    }

    /**
     * 处理 v-model 的事件
     * @returns 
     */
    listenModelEvent() {
        // 组件赋值事件处理
        if (!this.field) {
            return;
        }

        this._config.modelKeys.forEach((key, index) => {
            const self = this;
            this.props[self._config.modelKeyEvents[index]] = function () {
                self.setValue(arguments[0], key)
                const onName = propsToOnName(self._config.modelKeyEvents[index]);
                if (self.rule?.on?.[onName]) {
                    self.rule.on[onName](...arguments, FormFactory.api)
                }
                if (self.rule?.emits) {
                    const emitItem = self.rule.emits.find(item => item.event === onName)
                    if (emitItem) {
                        vm.emit(emitItem.alias, ...arguments, FormFactory.api)
                    }
                }
            }
        })
    }

    /**
     * 事件处理集合
     * @returns 
     */
    listenEvent() {
        this.listenRuleOnAndEmits()
        this.listenModelEvent()
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
        const titleRender = new RuleFactory(this.rule.title)
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
        if (this.display === false) return;
        return this.renderFormItem() || this.renderType()
    }
}