import { reactive, toRefs, provide, inject, h } from "vue"
import { RuleFactory } from './rule'
import { globalCache, LoaderFactory } from './loader'
import Api from './api'
import type { ComponentInternalInstance } from "vue"
import type { RuleType, PropsOptionType } from '../types'

export interface ModelValueType {
    [field: string]: any
}


/**
 * TODO:
 * 补充element ui 和 iview ui的支持配置
 * 支持国际化
 * 注意设置值的时候，如果是对象，需要处理
 * 
 * 还是需要计入form的层级结构
 * props.rule变化时候需要重载处理
 */
export default class FormFactory {

    public vm: ComponentInternalInstance

    public modelValue: ModelValueType

    public option: PropsOptionType

    public rules: RuleFactory[] = []

    public api: Api

    static formRefsName = "form"

    // 计入form层关系
    public baseVm: ComponentInternalInstance = null
    public allVms: ComponentInternalInstance[] = []

    constructor(vm: any) {
        if (!globalCache?.config) {
            new LoaderFactory(vm)
        }
        console.log(vm)
        this.vm = vm

        LoaderFactory.loaderComponents(vm.components)

        this.baseVm = inject('baseVm', null)

        if (this.baseVm === null) {
            provide('baseVm', vm)
            provide('allVms', this.allVms)
        } else {
            this.allVms = inject('allVms');
        }

        this.api = new Api(vm)

        this.api.setAllVms(this.allVms);

        this.initOption()
        this.initModelValue()
        this.initRule()
    }

    initModelValue() {
        const { modelValue } = toRefs(this.vm.props)
        this.modelValue = reactive({ ...modelValue.value as any })

        this.api.setModelValue(this.modelValue)
    }

    initRule() {
        const { rule } = toRefs(this.vm.props)
        this.rules = (rule.value as RuleType[]).map(item => new RuleFactory(item, this.modelValue, this.api, this.vm))
        this.api.setRfs(this.rules)
    }

    initOption() {
        const { option } = toRefs(this.vm.props)
        this.option = option.value as PropsOptionType
        if (!this.option?.form) {
            const baseVmOption = this.baseVm.props?.option as PropsOptionType
            this.option = reactive({
                isForm: baseVmOption?.isForm,
                form: baseVmOption?.form
            })
        }
    }

    updateModelValue(modelValue: ModelValueType) {
        if (modelValue) {
            for (let key in modelValue) {
                if (this.modelValue[key] !== modelValue[key]) {
                    this.api.setValue(key, modelValue[key])
                }
            }
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

    renderRule() {
        return this.rules.map(item => item.render())
    }

    /**
     * 渲染form
     * @returns 
     */
    renderForm() {
        const { config } = globalCache;
        return [
            h(LoaderFactory.getComponents(config.defaultName.form) as any, {
                ref: FormFactory.formRefsName,
                model: this.modelValue,
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