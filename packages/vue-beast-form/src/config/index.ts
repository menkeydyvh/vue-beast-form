import type { FrameworkFormBaseConfig, GlobalConfigType } from '../types'
import type { ComponentInternalInstance } from "vue"

/**
 * 支持组件多情况配置
 */
export default class Config {

    public vm: ComponentInternalInstance
    /**
     * form 组件名称相关定义
     */
    public baseConfig: FrameworkFormBaseConfig = {
        form: '',
        formPropsModel: '',
        formItem: '',
        formItemPropName: '',
        formItemPropRules: '',
        formItemPropLabel: '',
        formItemSlotTitle: '',
        formEventValidate: '',
        formEventClearValidate: ''
    };

    /**
     * 表单组件定义 v-model 的 :key
     */
    public model: { default: ['modelValue'] } & Record<string, string[]> = {
        default: ['modelValue']
    }

    /**
     * 表单组件定义 v-model 的 :key 对应的默认值 默认值null
     * PS：如果有特殊默认值需要配置出来，对应model的值的格式
     */
    public defaultValue: Record<string, any[]> = {}

    /**
     * 表单组件定义 v-model 的 :key 对应的事件名称 
     * PS：如果组件默认值与默认事件监听有出入需要默认配置
     */
    public modelEvent: Record<string, string[]> = {}

    /**
     * 表单组件定义 v-model 的 :key
     */
    public disabled: { default: 'disabled' } & Record<string, string> = {
        default: 'disabled'
    }

    constructor(vm: ComponentInternalInstance) {
        this.vm = vm

        const globalConfig = this.vm.appContext.config.globalProperties.$beastForm as GlobalConfigType
        if (globalConfig) {
            this.initConfig(globalConfig)
        } else {
            console.error("error: You need set app.config.globalProperties.$beastForm")
        }
    }

    /**
     * 初始化配置方法
     * @param option 
     * @returns 
     */
    initConfig(option: GlobalConfigType) {
        if (option.base && option.frameworks?.[option.base]?.baseConfig) {
            this.setKeyValue('baseConfig', option.frameworks[option.base].baseConfig)
        }

        if (option.frameworks) {
            for (let fname in option.frameworks) {
                if (option.frameworks[fname]?.model) {
                    this.setKeyValue("model", option.frameworks[fname].model)
                }
                if (option.frameworks[fname]?.defaultValue) {
                    this.setKeyValue("defaultValue", option.frameworks[fname].defaultValue)
                }
                if (option.frameworks[fname]?.modelEvent) {
                    this.setKeyValue("modelEvent", option.frameworks[fname].modelEvent)
                }
                if (option.frameworks[fname]?.disabled) {
                    this.setKeyValue("disabled", option.frameworks[fname].disabled)
                }
            }
        }
    }

    /**
     * 替换baseConfig值
     * @param config 
     */
    setKeyValue = (thisKey: "baseConfig" | "model" | "defaultValue" | "modelEvent" | "disabled", config: { [key: string]: any; }) => {
        if (["baseConfig", "model", "defaultValue", "modelEvent", "disabled"].includes(thisKey)) {
            for (let key in config) {
                this[thisKey][key] = config[key]
            }
        }
    }

    /**
     * 切换框架默认form配置的时候使用
     * @param fName 对应配置好的框架名称
     */
    switchFramework = (fName: string) => {
        const globalConfig = this.vm.appContext.config.globalProperties.$beastForm as GlobalConfigType
        if (globalConfig.frameworks[fName]?.baseConfig) {
            this.setKeyValue("baseConfig", globalConfig.frameworks[fName].baseConfig)
        }
    }

    /**
     * 获取配置中的 model
     * @param componentName 
     * @returns 
     */
    getModelValueKeys(componentName: string) {
        const fcm = this.model[componentName];
        if (fcm) {
            return [...fcm]
        } else {
            return this.model.default
        }

    }

    /**
     *  获取配置中的 modelEvent,如keys有值并对齐keys数组长度
     * @param componentName 
     * @param keys 
     * @returns 
     */
    getModelValueChangeEvents(componentName: string, keys: string[]) {
        const fcke = this.modelEvent[componentName]
        if (keys?.length) {
            return keys.map((key, i) => {
                return fcke?.[i] || `onUpdate:${key}`
            })
        } else {
            return fcke || []
        }
    }

    /**
     * 获取配置中的 defaultValue,如keys有值并对齐keys数组长度
     * @param componentName 
     * @param keys 
     * @returns 
     */
    getModelValueDefaultNullValues(componentName: string, keys: string[]) {
        const fcdv = this.defaultValue[componentName]
        if (keys?.length) {
            return keys.map((_key, i) => {
                if (fcdv?.[i]) {
                    return fcdv[i]
                } else {
                    return null
                }
            })
        } else {
            return fcdv || [];
        }
    }

    /**
     * 获取配置中的 disabled
     * @param componentName 
     * @returns 
     */
    getComponentDisabled(componentName: string) {
        const fcd = this.disabled[componentName]
        return typeof fcd === "string" ? fcd : this.disabled.default
    }
}


