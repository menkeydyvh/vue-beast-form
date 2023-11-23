import { reactive, toRefs, provide, inject, h } from "vue"
import { RuleFactory } from './rule'
import { globalCache, LoaderFactory } from './loader'
import apiFactory from './api'
import type Api from './api'
import type { ComponentInternalInstance } from "vue"
import type { RuleType, PropsOptionType } from '../types'

export default class FormFactory {

    public vm: ComponentInternalInstance

    public modelValue: Record<string, any>

    public option: PropsOptionType

    public rules: RuleFactory[] = []

    public disabled: boolean

    public api: Api

    static formRefsName = "form"

    // 顶层vm
    public baseVm: ComponentInternalInstance = null
    // vm集合
    public allVms: ComponentInternalInstance[] = []

    constructor(vm: ComponentInternalInstance) {
        if (!globalCache?.config) {
            new LoaderFactory(vm)
        }
        const option = vm.props.option as PropsOptionType
        if (option?.framework) {
            globalCache.config.switchFramework(option.framework);
        }

        this.vm = vm

        this.baseVm = inject('baseVm', null)

        if (this.baseVm === null) {
            this.baseVm = vm;
            provide('baseVm', vm)
            provide('allVms', this.allVms)
        } else {
            this.allVms = inject('allVms');
        }

        this.api = new apiFactory(vm)

        this.api.setAllVms(this.allVms);

        this.initOption()
        this.initModelValue()
        this.initRule()
    }

    initModelValue() {
        const modelValue = this.vm.props.modelValue as Record<string, any>
        this.modelValue = reactive({ ...modelValue })

        this.api.setModelValue(this.modelValue)
    }

    initRule() {
        const rule = this.vm.props.rule as RuleType[];

        this.rules = (rule).filter(
            item => !!item
        ).map(
            item => new RuleFactory(item, this.modelValue, this.api, this.vm, this.option.isI18n)
        )

        this.api.setRfs(this.rules)
    }

    initDisabled() {
        const disabled = this.vm.props.disabled as boolean;

        this.disabled = disabled

        this.rules.forEach(rule => {
            rule.setDisabled(this.disabled, true)
        })
    }

    initOption() {
        const option = this.vm.props.option as PropsOptionType,
            baseVmOption = this.baseVm.props?.option as PropsOptionType,
            formProps = { ...globalCache?.basePropsOption?.form, ...baseVmOption?.form, ...option?.form }

        this.option = { ...globalCache.basePropsOption, ...baseVmOption, ...option, form: formProps }
    }

    updateModelValue(modelValue: Record<string, any>) {
        if (modelValue) {
            for (let key in modelValue) {
                if (this.modelValue[key] !== modelValue[key]) {
                    this.api.publishApi().setValue(key, modelValue[key])
                }
            }
        }
    }

    /**
     * 缓存api
     */
    cacheApi(name: string) {
        LoaderFactory.cacheApi(name, this.api.publishApi())
    }

    delCacheApi(name: string) {
        LoaderFactory.removeCacheApi(name)
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
        const { config } = globalCache, formProps: any = {};
        let formTag = LoaderFactory.getComponents(config.baseConfig.form) as any;

        if (config.baseConfig.form && formTag) {
            formProps.ref = FormFactory.formRefsName
            const fpKeys = Object.keys(formTag.props);
            if (config.baseConfig.formPropsModel && fpKeys.includes(config.baseConfig.formPropsModel)) {
                formProps[config.baseConfig.formPropsModel] = this.modelValue
            }
            if (this.option?.form) {
                for (let key in this.option.form) {
                    if (fpKeys.includes(key)) {
                        formProps[key] = this.option.form[key]
                    }
                }
            }
        } else {
            formTag = 'div'
            if (this.option?.form) {
                for (let key in this.option.form) {
                    formProps[key] = this.option.form[key]
                }
            }
        }

        return [
            h(formTag,
                formProps,
                {
                    default: () => this.renderRule()
                }
            )
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