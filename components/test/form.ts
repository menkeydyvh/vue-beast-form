import { unref, reactive, getCurrentInstance, resolveDynamicComponent, provide, inject, h } from "vue"
import { RuleFactory } from './rule'
import config from '../config'
import Api from './api'
import type ConfigType from '../config'
import type { ComponentInternalInstance, VNodeTypes } from "vue"
import type { RuleType, PropsOptionType } from '../types'


interface BaseInjectType {
    // 顶层vm
    baseVm: ComponentInternalInstance
    // 顶层计入所有层vm
    allVms: ComponentInternalInstance[]
    //渲染组件缓存
    tagCacheComponents: {
        [ruleType: string]: VNodeTypes
    }
    config: ConfigType
}

export var baseInject: BaseInjectType

export var modelValue: {
    [field: string]: any
}


/**
 * TODO:
 * 补充element ui 和 iview ui的支持配置
 * props.disabled 的修改不重绘整个组件？
 * 支持国际化
 * 注意设置值的时候，如果是对象，需要处理
 * 
 * modelValue和api都需要针对form创建 
 * 还是需要计入form的层级结构
 * 
 * 测试事件
 * 还有一些api没实现
 */
export class FormFactory {

    public vm: ComponentInternalInstance

    public option: PropsOptionType

    public rules: RuleFactory[]

    public api: Api

    static formRefsName = "form"

    constructor() {
        this.vm = getCurrentInstance()
        this.api = new Api()

        baseInject = inject<BaseInjectType>('baseInject', null)

        if (!baseInject) {
            baseInject = {
                baseVm: this.vm,
                allVms: [],
                tagCacheComponents: {},
                config: new config(),
            }
            provide('baseInject', baseInject)
            this.initTagCacheComponents()
        }

        this.option = unref(this.vm.props.option as PropsOptionType)
        if (!this.option?.form) {
            const baseVmOption = baseInject.baseVm.props.option as PropsOptionType
            this.option = reactive({
                isForm: baseVmOption?.isForm,
                form: baseVmOption?.form
            })
        }

        modelValue = reactive({ ...unref(this.vm.props.modelValue as any) })

        this.rules = unref(this.vm.props.rule as RuleType[]).map(item => new RuleFactory(item, this.api))

        this.api._updateRfs(this.rules)

        console.log(this.vm)
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
        if (baseInject && baseInject.allVms) {
            let idx = baseInject.allVms.findIndex(item => item.uid === this.vm.uid)
            if (idx === -1) {
                baseInject.allVms.push(this.vm)
            }
        }
    }

    /**
     * 除去记录表单vm
     */
    delVm() {
        if (baseInject && baseInject.allVms) {
            let idx = baseInject.allVms.findIndex(item => item.uid === this.vm.uid)
            if (idx > -1) {
                baseInject.allVms.splice(idx, 1)
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
                model: modelValue,
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