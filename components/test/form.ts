import { unref, reactive, getCurrentInstance, resolveDynamicComponent, provide, inject, h } from "vue"
import { RuleFactory } from './rule'
import config from '../config'
import Api from './api'
import type ConfigType from '../config'
import type { ComponentInternalInstance, VNodeTypes } from "vue"
import type { RuleType, PropsOptionType } from '../types'

interface BaseInjectType {
    //渲染组件缓存
    tagCacheComponents: {
        [ruleType: string]: VNodeTypes
    }
    config: ConfigType
}

export interface ModelValueType {
    [field: string]: any
}

export var baseInject: BaseInjectType

/**
 * TODO:
 * 补充element ui 和 iview ui的支持配置
 * props.disabled 的修改不重绘整个组件？
 * 支持国际化
 * 注意设置值的时候，如果是对象，需要处理
 * 
 * 还是需要计入form的层级结构
 * 
 * 测试事件
 * 还有一些api没实现
 */
export default class FormFactory {

    public vm: ComponentInternalInstance

    public modelValue: ModelValueType

    public option: PropsOptionType

    public rules: RuleFactory[]

    public api: Api

    static formRefsName = "form"

    // 计入form层关系
    public baseVm: ComponentInternalInstance = null
    public allVms: ComponentInternalInstance[] = []

    constructor() {
        if (!baseInject) {
            baseInject = {
                tagCacheComponents: {},
                config: new config(),
            }
            this.initTagCacheComponents()
        }

        this.vm = getCurrentInstance()

        this.baseVm = inject('baseVm', null)

        if (this.baseVm === null) {
            provide('baseVm', this.vm)
            provide('allVms', this.allVms)
        } else {
            this.allVms = inject('allVms');
        }

        this.api = new Api()


        this.option = unref(this.vm.props.option as PropsOptionType)
        if (!this.option?.form) {
            const baseVmOption = this.baseVm.props?.option as PropsOptionType
            this.option = reactive({
                isForm: baseVmOption?.isForm,
                form: baseVmOption?.form
            })
        }

        this.modelValue = reactive({ ...unref(this.vm.props.modelValue as any) })

        this.rules = unref(this.vm.props.rule as RuleType[]).map(item => new RuleFactory(item, this.modelValue, this.api))

        this.api.setRfs(this.rules)
        this.api.setModelValue(this.modelValue)
        this.api.setAllVms(this.allVms);
    }

    initTagCacheComponents() {
        const { config, tagCacheComponents } = baseInject;
        if (config.defaultName.form) {
            tagCacheComponents[config.defaultName.form] = resolveDynamicComponent(config.defaultName.form)

        }
        if (config.defaultName.formItem) {
            tagCacheComponents[config.defaultName.formItem] = resolveDynamicComponent(config.defaultName.formItem)

        }
    }

    /**
     * 记录表单vm
     */
    addVm() {
        if (this.allVms) {
            let idx = this.allVms.findIndex(item => item.uid === this.vm.uid)
            if (idx === -1) {
                this.allVms.push(this.vm)
            }
        }
    }

    /**
     * 除去记录表单vm
     */
    delVm() {
        if (this.allVms) {
            let idx = this.allVms.findIndex(item => item.uid === this.vm.uid)
            if (idx > -1) {
                this.allVms.splice(idx, 1)
            }
        }
    }

    /**
     * 渲染form
     * @returns 
     */
    renderForm() {
        const { config, tagCacheComponents } = baseInject;
        return [
            h(tagCacheComponents[config.defaultName.form] as any, {
                ref: FormFactory.formRefsName,
                model: this.modelValue,
                ...this.option?.form,
            }, {
                default: () => this.rules.map(item => item.render())
            })
        ]
    }

    /**
     * 渲染
     * @returns 
     */
    render() {
        if (this.option.isForm === false) {
            return this.rules.map(item => item.render())
        } else {
            return this.renderForm()
        }
    }

}