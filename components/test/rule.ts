import { unref, reactive, getCurrentInstance, resolveDynamicComponent, provide, inject, h } from "vue"
import renderFactory from './render'
import config from '../config'
import type ConfigType from '../config'
import type { ComponentInternalInstance, VNodeTypes, DefineComponent } from "vue"
import type { RuleType, PropsOptionType } from '../types'


export interface BaseInjectType {
    // 顶层vm
    baseVm: ComponentInternalInstance
    // 顶层计入所有层vm
    allVms: ComponentInternalInstance[]
    //渲染组件缓存
    tagCacheComponents: {
        [ruleType: string]: {
            config?: {
                modelKeys: string[]
                modelKeyEvents: string[]
                modelKeyDefaultValues: any[]
            }
            component: VNodeTypes
        }
    }
    config: ConfigType
}

export var vm: ComponentInternalInstance
export var baseInject: BaseInjectType
export var model = {}
export var formRefsName = "form"

export default class RuleFactory {
    public config = new config()
    public rules: RuleType[]
    public option: PropsOptionType
    // 顶层管理

    constructor() {
        vm = getCurrentInstance()
        baseInject = inject<BaseInjectType>('baseInject', null)

        if (!baseInject) {
            baseInject = {
                baseVm: vm,
                allVms: [],
                tagCacheComponents: {},
                config: new config()
            }
            provide('baseInject', baseInject)
            this.initTagCacheComponents()
        }

        model = unref(vm.props.modelValue as any) || reactive({})

        this.rules = unref(vm.props.rule as RuleType[])
        this.option = unref(vm.props.option as PropsOptionType)
        if (!this.option?.form) {
            const baseVmOption = baseInject.baseVm.props.option as PropsOptionType
            this.option = {
                isForm: baseVmOption?.isForm,
                form: baseVmOption?.form
            }
        }
    }

    initTagCacheComponents() {
        const { config, tagCacheComponents } = baseInject;
        if (config.defaultName.form) {
            tagCacheComponents[config.defaultName.form] = {
                component: resolveDynamicComponent(config.defaultName.form)
            }
        }
        if (config.defaultName.formItem) {
            tagCacheComponents[config.defaultName.formItem] = {
                component: resolveDynamicComponent(config.defaultName.formItem)
            }
        }
    }

    /**
     * 添加子表单
     */
    addVm() {
        if (baseInject && baseInject.allVms) {
            let idx = baseInject.allVms.findIndex(item => item.uid === vm.uid)
            if (idx === -1) {
                baseInject.allVms.push(vm)
            }
        }
    }

    /**
     * 除去子表单
     */
    delVm() {
        if (baseInject && baseInject.allVms) {
            let idx = baseInject.allVms.findIndex(item => item.uid === vm.uid)
            if (idx > -1) {
                baseInject.allVms.splice(idx, 1)
            }
        }
    }

    /**
     * 渲染规则
     * @returns 
     */
    renderRule() {
        const rr = this.rules.map(item => {
            return new renderFactory(item)
        })
        // TODO:执行了两次渲染
        return rr.map(item => item.render())
    }

    /**
     * 渲染form
     * @returns 
     */
    renderForm() {
        const { config, tagCacheComponents } = baseInject;
        return [
            h(tagCacheComponents[config.defaultName.form].component as DefineComponent, {
                model,
                ref: formRefsName,
                ...this.option?.form,
            }, {
                default: () => this.renderRule()
            })
        ]
    }

    /**
     * 渲染
     * @returns 
     */
    render() {
        if (this.option.isForm === false) {
            return this.renderRule()
        } else {
            return this.renderForm()
        }
    }

}