import { unref, reactive, getCurrentInstance, resolveDynamicComponent, provide, inject, h } from "vue"
import renderFactory from './render'
import apiFactory from './api'
import config from '../config'
import type ConfigType from '../config'
import type { ComponentInternalInstance, VNodeTypes } from "vue"
import type { RuleType, PropsOptionType } from '../types'


export interface BaseInjectType {
    // 顶层vm
    baseVm: ComponentInternalInstance
    // 顶层计入所有层vm
    allVms: ComponentInternalInstance[]
    //渲染组件缓存
    tagCacheComponents: {
        [ruleType: string]: VNodeTypes
    }
    config: ConfigType
    api: apiFactory
}

export var vm: ComponentInternalInstance
export var baseInject: BaseInjectType
export var formRefsName = "form"
export var modelKeyAry: string[] = []


/**
 * TODO:
 * 补充element ui 和 iview ui的支持配置
 * props.disabled 的修改不重绘整个组件？
 * 支持国际化
 * 注意设置值的时候，如果是对象，需要处理
 * 
 * 未处理 vm.props.modelValue
 * 测试事件
 * 还有一些api没实现
 */
export default class RuleFactory {
    public config = new config()
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
                config: new config(),
                api: new apiFactory()
            }
            provide('baseInject', baseInject)
            this.initTagCacheComponents()
        }


        this.option = unref(vm.props.option as PropsOptionType)
        if (!this.option?.form) {
            const baseVmOption = baseInject.baseVm.props.option as PropsOptionType
            this.option = reactive({
                isForm: baseVmOption?.isForm,
                form: baseVmOption?.form
            })
        }
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
            let idx = baseInject.allVms.findIndex(item => item.uid === vm.uid)
            if (idx === -1) {
                baseInject.allVms.push(vm)
            }
        }
    }

    /**
     * 除去记录表单vm
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
        const rr = unref(vm.props.rule as RuleType[]).map(item => new renderFactory(item))

        baseInject.api._updateRfs(rr)

        // PS:注意 model的使用否则会触发执行多次渲染
        console.log("renderRule", rr)
        return rr.map(item => item.render())
    }

    /**
     * 渲染form
     * @returns 
     */
    renderForm() {
        const { config, tagCacheComponents } = baseInject;
        return [
            h(tagCacheComponents[config.defaultName.form] as any, {
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