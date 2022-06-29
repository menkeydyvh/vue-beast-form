import { h, reactive, toRef, resolveDirective, withDirectives } from 'vue'
import { globalCache, LoaderFactory } from './loader'
import type Api from './api'
import type { VNodeTypes, ComponentInternalInstance, Ref } from 'vue'
import type { ModelValueType } from './form'
import type { RuleType, EmitType } from '../types'
import { onToPropsName, propsToOnName } from '../tool'
import { deepCopy } from '../tool'

export class RuleFactory {

    public vm: ComponentInternalInstance | any

    public rule: RuleType

    public api: Api

    public modelValue: ModelValueType

    /**
     * 有v-model的时候这个值会有数据
     */
    public field: string

    public props: {
        [key: string]: any
    }

    public display: Ref<boolean>

    public children: Array<RuleFactory | string> = []

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

    constructor(rule: RuleType, modelValue: any, api: Api, vm: ComponentInternalInstance) {
        this.vm = vm
        this.rule = rule;
        this.modelValue = modelValue;
        this.api = api;
        this.props = reactive({})

        this.display = toRef(this.rule, "display")

        this.initConfigCache()
        this.initProps()
        this.initValue()
        this.listenEvent()
        this.initChildre()
    }

    private getTag() {
        return LoaderFactory.getComponents(this.rule.type) as any
    }

    initConfigCache() {

        let rdc = this.getTag()

        if (typeof rdc === "object") {
            const config = globalCache.config, rdcName = rdc.name;
            // disabled
            this._config.disabled = config.getComponentDisabled(rdcName)

            let modelKeys: string[] = [], modelKeyEvents = [], modelKeyDefaultValues = [], rdcPropsKey = rdc.props ? Object.keys(rdc.props || {}) : [];
            // -- v-model配置
            if (this.rule.vModelKey) {
                if (Array.isArray(this.rule.vModelKey)) {
                    modelKeys = this.rule.vModelKey
                } else {
                    modelKeys = [this.rule.vModelKey]
                }
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
                if (this.rule.vModelKeyDefaultValue) {
                    if (Array.isArray(this.rule.vModelKeyDefaultValue)) {
                        if (modelKeys.length === 1) {
                            modelKeyDefaultValues[0] = this.rule.vModelKeyDefaultValue
                        } else {
                            modelKeyDefaultValues = this.rule.vModelKeyDefaultValue
                        }
                    } else {
                        modelKeyDefaultValues.push(this.rule.vModelKeyDefaultValue)
                    }
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
        let tagPropsKeys = []
        if (typeof tag === 'object' && tag.props) {
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

        if (!(this.rule.title === false || !this.field)) {
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
     * 禁用
     * @param disabled 
     */
    setDisabled(disabled: boolean) {
        if (this._config.disabled) {
            if (this.vm.props.disabled === true) {
                this.setProps(this._config.disabled, true)
            } else {
                this.setProps(this._config.disabled, disabled === true)
            }
        }
    }

    setProps(key: string, value: any) {
        this.props[key] = value
    }

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

        this.vm.emit('changeField', this.field, this.getValue(), this.api)
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
        if (rule) {
            const startIndex = index === undefined || index === null ? this.children.length : index
            this.children.splice(startIndex, 0, typeof rule === "object" ? new RuleFactory(rule, this.modelValue, this.api, this.vm) : rule)
        }
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
                callback(...arguments, self.api)
            } else {
                self.rule.on[event](...arguments, self.api)
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
                self.vm.emit(eType.alias, ...arguments, self.api)
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
                    self.rule.on[onName](...arguments, self.api)
                }
                if (self.rule?.emits) {
                    const emitItem = self.rule.emits.find(item => item.event === onName)
                    if (emitItem) {
                        self.vm.emit(emitItem.alias, ...arguments, self.api)
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
            const solt = {
                default: []
            }, result = {};
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
                this.getTag(),
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
        const titleRender = new RuleFactory(this.rule.title, this.modelValue, this.api, this.vm)
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
        const config = globalCache.config, props = { ...this.rule.attrs }, slot = {
            default: () => this.renderType()
        };
        if (this.rule.class) {
            props.class = this.rule.class;
        }
        if (this.rule.style) {
            props.style = this.rule.style;
        }

        props[config.defaultName.formItemPropName] = this.rule.field
        if (this.props[this._config.disabled] !== true && this.rule.validate) {
            if (this.rule.validate.find(item => item.required)) {
                props.required = true
            }
            props[config.defaultName.formItemPropRules] = this.rule.validate
        }

        if (typeof this.rule.title === 'string') {
            props[config.defaultName.formItemPropLabel] = this.rule.title;
        } else if (typeof this.rule.title === 'object') {
            slot[config.defaultName.formItemSlotTitle] = () => this.renderTitle()
        }

        return h(LoaderFactory.getComponents(config.defaultName.formItem) as any, props, slot)
    }

    /**
     * 渲染
     * @returns 
     */
    render() {
        if (this.display.value === false) return;
        return this.renderFormItem() || this.renderType()
    }
}