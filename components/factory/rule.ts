import { h, reactive, unref, ref, resolveDirective, withDirectives } from 'vue'
import { globalCache, LoaderFactory } from './loader'
import { onToPropsName, propsToOnName } from '../tool'
import { deepCopy } from '../tool'
import type Api from './api'
import type { VNode, ComponentInternalInstance, Ref } from 'vue'
import type { ModelValueType } from './form'
import type { RuleType, EmitType } from '../types'


export class RuleFactory {

    public vm: ComponentInternalInstance | any

    public rule: RuleType

    public titleRule: RuleFactory

    public api: Api

    public isI18n: boolean

    public component: VNode

    public modelValue: ModelValueType

    /**
     * 有v-model的时候这个值会有数据
     */
    public field: string

    public props = reactive<{
        [key: string]: any
    }>({})

    public formItemProps = reactive<{
        [key: string]: any
    }>({})

    public display: Ref<boolean>

    public childrenSlot = reactive<{
        [slot: string]: Array<RuleFactory | string> | Function
    }>({})

    private _config: {
        disabled: string
        modelKeys: string[]
        modelKeyEvents: string[]
        modelKeyDefaultValues: any[],
    } = {
            disabled: "",
            modelKeys: [],
            modelKeyEvents: [],
            modelKeyDefaultValues: [],
        }

    constructor(rule: RuleType, modelValue: any, api: Api, vm: ComponentInternalInstance, isI18n: boolean) {
        this.vm = vm
        this.rule = rule;
        this.modelValue = modelValue;
        this.api = api;
        this.isI18n = isI18n;

        this.display = ref(this.rule.display)

        if (this.rule.title && typeof this.rule.title === "object") {
            this.titleRule = new RuleFactory(this.rule.title, this.modelValue, this.api, this.vm, isI18n)
        }


        this.initConfigCache()
        this.initProps()
        this.initValue()
        this.listenEvent()
        this.initChildren()

    }

    private getTag() {
        return this.rule?.type ? LoaderFactory.getComponents(this.rule.type) as any : null
    }

    initConfigCache() {
        let rdc = this.getTag()

        if (typeof rdc === "object") {
            // console.log(rdc)
            const config = globalCache.config, rdcName = rdc.name;
            // disabled
            this._config.disabled = config.getComponentDisabled(rdcName)

            let modelKeys: string[] = [],
                modelKeyEvents = [],
                modelKeyDefaultValues = [],
                rdcPropsKey = rdc.props ? Object.keys(rdc.props || {}) : [];

            // -- v-model配置
            if (this.rule.model.length) {
                modelKeys = this.rule.model;
            }
            if (modelKeys.length === 0) {
                modelKeys = config.getModelValueKeys(rdcName)
            }
            
            // 过滤验证 确认这个key在这个props里
            modelKeys = modelKeys.filter(item => rdcPropsKey.includes(item))

            if (modelKeys.length) {
                // -- 事件配置
                modelKeyEvents = config.getModelValueChangeEvents(rdcName, modelKeys)

                // -- 默认空值配置
                if (this.rule.defaultValue?.length) {
                    modelKeyDefaultValues = this.rule.defaultValue
                }
                if (modelKeyDefaultValues.length === 0) {
                    modelKeyDefaultValues = config.getModelValueDefaultNullValues(rdcName, modelKeys)
                }

                this.field = this.rule.field

                this._config.modelKeys = modelKeys
                this._config.modelKeyEvents = modelKeyEvents
                this._config.modelKeyDefaultValues = modelKeyDefaultValues
            }
        }
    }

    initValue() {
        if (!this.field) {
            return
        }

        let data: any
        if (this._config.modelKeys.length === 1) {
            if (this.modelValue?.[this.field] !== undefined) {
                data = this.modelValue[this.field]
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
                if (this.modelValue?.[this.field]?.[key] !== undefined) {
                    data[key] = this.modelValue[this.field][key]
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

        if (!Object.keys(this.modelValue).includes(this.field)) {
            this.modelValue[this.field] = data
        }
    }

    initProps() {
        const tag = this.getTag();

        if (typeof tag === 'object') {

            let tagPropsKeys = []
            // 是组件
            if (tag.props) {
                tagPropsKeys = Object.keys(tag.props)
            }

            if (this.rule.props) {
                for (let key in this.rule.props) {
                    this.props[key] = this.rule.props[key]
                }
            }

            if (this._config.disabled && tagPropsKeys.includes(this._config.disabled)) {
                this.props[this._config.disabled] = false
            }

            if (globalCache.config.baseConfig.formItem && this.rule.title !== false) {
                if (this.rule.attrs) {
                    for (let key in this.rule.attrs) {
                        if (!tagPropsKeys.includes(key)) {
                            this.formItemProps[key] = this.rule.attrs[key]
                        }
                    }
                }
                if (this.rule.style) {
                    this.formItemProps.style = this.rule.style
                }
                if (this.rule.class) {
                    this.formItemProps.class = this.rule.class
                }
            } else {
                if (this.rule.attrs) {
                    for (let key in this.rule.attrs) {
                        if (!tagPropsKeys.includes(key)) {
                            this.props[key] = this.rule.attrs[key]
                        }
                    }
                }
                if (this.rule.style) {
                    this.props.style = this.rule.style
                }
                if (this.rule.class) {
                    this.props.class = this.rule.class
                }
            }

        } else {
            // 不是组件
            if (this.rule.props) {
                for (let key in this.rule.props) {
                    this.props[key] = this.rule.props[key]
                }
            }
            if (this.rule.attrs) {
                for (let key in this.rule.attrs) {
                    this.props[key] = this.rule.attrs[key]
                }
            }
            if (this.rule.style) {
                this.props.style = this.rule.style
            }
            if (this.rule.class) {
                this.props.class = this.rule.class
            }

        }
    }

    initChildren() {
        const slef = this;
        if (this.rule.children) {
            if (Array.isArray(this.rule.children)) {
                this.rule.children.map(rule => {
                    this.addChildren(rule)
                })
            } else {
                for (const slot in this.rule.children) {
                    const childSlot = this.rule.children[slot]
                    this.childrenSlot[slot] = function () {
                        const csr: Array<string | RuleType> = childSlot(...arguments)
                        try {
                            if (Array.isArray(csr)) {
                                return csr.map(csrItem => {
                                    if (typeof csrItem === 'string') {
                                        return csrItem
                                    } else {
                                        return (new RuleFactory(csrItem, slef.modelValue, slef.api, slef.vm, slef.isI18n)).render()
                                    }
                                })
                            }
                        } catch (error) {
                            return csr
                        }
                    }
                }
            }
        }
    }

    // 底下是api相关

    /**
     * 禁用
     * @param disabled 
     * @param isChild 
     */
    setDisabled(disabled: boolean, isChild?: boolean) {
        if (this._config.disabled) {
            if (this.vm.props.disabled === true) {
                this.setProps(this._config.disabled, true)
            } else {
                this.setProps(this._config.disabled, disabled === true ? true : undefined)
            }
        }

        if (isChild) {
            for (let key in this.childrenSlot) {
                const childSlot = this.childrenSlot[key]
                if (Array.isArray(childSlot)) {
                    childSlot.forEach(child => {
                        if (typeof child === 'object') {
                            child.setDisabled(disabled, isChild)
                        }
                    })
                }
            }
        }
    }

    /**
     * 对设置props处理
     * @param key 
     * @param value 
     */
    setProps(key: string, value: any) {
        this.props[key] = value
    }

    /**
     * 对设置formItemProps处理
     * @param key 
     * @param value 
     */
    setFormItemProps(key: string, value: any) {
        this.formItemProps[key] = value
    }

    /**
     * 对设置attr处理
     * @param key 
     * @param value 
     */
    setAttrs(key: string, value: any) {
        const tag = this.getTag();
        let tagPropsKeys = []
        if (typeof tag === 'object' && tag.props) {
            tagPropsKeys = Object.keys(tag.props)
        }
        if (!tagPropsKeys.includes(key)) {
            this.setProps(key, value)
        }
    }

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

        this.modelValue[this.field] = this.getValue()

        this.vm.emit('changeField', this.field, this.getValue(), this.api.publishApi())
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
    addChildren(rule: RuleType | string, index?: number, slot: string = 'default') {
        if (rule) {
            if (typeof rule === "object") {
                if (rule.slot) {
                    slot = rule.slot
                }

                if (!this.childrenSlot[slot]) {
                    this.childrenSlot[slot] = []
                }
                const childSlot = this.childrenSlot[slot]

                if (Array.isArray(childSlot)) {
                    const startIndex = typeof index === 'number' ? index : childSlot.length
                    const newRf = new RuleFactory(rule, this.modelValue, this.api, this.vm, this.isI18n);
                    childSlot.splice(startIndex, 0, newRf)
                }

            } else {
                if (!this.childrenSlot.default) {
                    this.childrenSlot.default = []
                }
                if (Array.isArray(this.childrenSlot.default)) {
                    const startIndex = typeof index === 'number' ? index : this.childrenSlot.default.length
                    this.childrenSlot.default.splice(startIndex, 0, rule)
                }
            }
        }
    }

    /**
     * 删除children
     * @param index 
     */
    delChildren(index?: number, slot: string = 'default') {
        const childSlot = this.childrenSlot[slot]
        if (Array.isArray(childSlot)) {
            const endIndex = typeof index === 'number' ? 1 : childSlot.length
            childSlot.splice(index, endIndex)
        }
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
                callback(...arguments, self.api.publishApi())
            } else {
                self.rule.on[event](...arguments, self.api.publishApi())
            }
        }
    }

    /**
     * 添加emit
     * @param eType 
     */
    addEmit(eType: EmitType) {
        if (eType) {
            const self = this;
            this.props[onToPropsName(eType.event)] = function () {
                self.vm.emit(eType.alias, ...arguments, self.api.publishApi())
            }
        }
    }

    /**
    * 删除事件
    * @param event 
    */
    delOnOrEmit(event: string) {
        const propsEventName = onToPropsName(event)
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
        const listens: {
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
                const emitItem = this.rule.emits.find(emit => emit.event === item.event)
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
                    self.rule.on[onName](...arguments, self.api.publishApi())
                }
                if (self.rule?.emits) {
                    const emitItem = self.rule.emits.find(item => item.event === onName)
                    if (emitItem) {
                        self.vm.emit(emitItem.alias, ...arguments, self.api.publishApi())
                    }
                }
            }
        })
    }

    /**
     * 处理i18n
     * @param str 
     * @returns 
     */
    setI18n(str: string): string {
        if (this.isI18n && globalCache.t) {
            return globalCache.t(str)
        } else {
            return str
        }
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
        const result = {}
        for (let slot in this.childrenSlot) {
            const childSlot = this.childrenSlot[slot];
            if (Array.isArray(childSlot) && childSlot.length) {
                result[slot] = () => childSlot.map(rc => {
                    if (typeof rc === 'string') {
                        return this.setI18n(rc)
                    } else if (typeof rc === 'object') {
                        return rc.render()
                    }
                })
            } else if (typeof childSlot === 'function') {
                result[slot] = childSlot
            }
        }
        return Object.keys(result).length ? result : undefined
    }


    /**
     * 渲染指令
     * @param vNode 
     * @returns 
     */
    renderDirectives(vNode: VNode) {
        this.component = vNode
        if (this.rule.directives) {
            const directives = this.rule.directives.map(item => {
                if (Array.isArray(item)) {
                    if (typeof item[0] === 'string') {
                        item[0] = resolveDirective(item[0])
                    }
                    return item
                }
            }).filter(item => item)
            return withDirectives(vNode, directives as any)
        } else {
            return vNode
        }
    }

    /**
     * 渲染type
     * @returns 
     */
    renderType() {
        return this.renderDirectives(h(
            this.getTag(),
            this.props,
            this.renderChildrenSolt()
        ))
    }

    /**
     * 渲染formItem
     * @returns 
     */
    renderFormItem() {
        const self = this, config = globalCache.config;
        if (!this.field) {
            return
        }
        if (this.rule.title === false) {
            return
        }

        if (!config.baseConfig.formItem) {
            return
        }

        const props = {},
            slot = {
                default: () => [this.renderType()],
            };

        props[config.baseConfig.formItemPropName] = this.rule.field
        if (this.props[this._config.disabled] !== true && this.rule.validate) {
            if (this.rule.validate.find(item => item.required)) {
                props['required'] = true
            }
            props[config.baseConfig.formItemPropRules] = this.rule.validate.map(v => {
                const nv = { ...v };
                if (nv.message) {
                    nv.message = this.setI18n(nv.message)
                }
                if (v.validator) {
                    nv.validator = function () {
                        return v.validator(...arguments, self.api.publishApi())
                    }
                }
                return nv
            })
        }

        if (typeof this.rule.title === 'string') {
            props[config.baseConfig.formItemPropLabel] = this.setI18n(this.rule.title);
        } else if (this.titleRule) {
            slot[config.baseConfig.formItemSlotTitle] = () => this.titleRule.render()
        }

        return h(LoaderFactory.getComponents(config.baseConfig.formItem) as any, { ...props, ...this.formItemProps }, slot)
    }

    /**
     * 渲染
     * @returns 
     */
    render() {
        if (unref(this.display) === false) return;
        return this.renderFormItem() || this.renderType()
    }
}