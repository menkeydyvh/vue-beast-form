import { getCurrentInstance } from 'vue'
import { framework } from './framework'
import type { DefaultName, ConfigOptionsType } from '../types'

/**
 * 支持组件多情况配置
 */
export default class config {
    /**
     * form 组件名称相关定义
     */
    public defaultName: DefaultName = {};

    /**
     * 表单组件定义 v-model 的 :key
     */
    public formDataComponentKey: {
        [ComponentName: string]: string | string[];
    } = {
            default: 'modelValue'
        }

    /**
     * 表单组件定义 v-model 的 :key 对应的默认值 默认值null
     * PS：如果有特殊默认值需要配置出来，对应formDataComponentKey的值的格式
     */
    public formDataComponentDefaultValue: {
        [ComponentName: string]: any;
    } = {}

    /**
     * 表单组件定义 v-model 的 :key 对应的事件名称 
     * PS：如果组件默认值与默认事件监听有出入需要默认配置
     */
    public formDataComponentChangeKeyEvent: {
        [ComponentName: string]: string | string[];
    } = {}

    /**
  * 表单组件定义 v-model 的 :key
  */
    public formDataComponentDisabled: {
        [ComponentName: string]: string;
    } = {
            default: 'disabled'
        }

    constructor(option?: ConfigOptionsType) {
        if (option) {
            this.initConfig(option)
        } else {
            this.initGlobalConfig()
        }
    }

    /**
     * 初始化全局配置
     */
    initGlobalConfig() {
        const globalConfig = getCurrentInstance().appContext.config.globalProperties.$jsonLayout as ConfigOptionsType
        if (!globalConfig) {
            console.error("error: You need set app.config.globalProperties.$jsonLayout")
            return
        }
        this.initConfig(globalConfig)
    }

    /**
     * 初始化配置方法
     * @param option 
     * @returns 
     */
    initConfig(option: ConfigOptionsType) {
        if (!option) {
            return
        }

        if (option.base) {
            if (framework[option.base]) {
                for (let key in framework[option.base]) {
                    this.setKeyValue(key, framework[option.base][key])
                }
            }
        }
        if (option.frameworks) {
            option.frameworks.forEach((item) => {
                if (item != option.base && framework[item]) {
                    if (!option.base) {
                        option.base = item
                        this.setKeyValue("defaultName", framework[item].defaultName)
                    }
                    for (let key in framework[item]) {
                        if (key != "defaultName") {
                            this.setKeyValue(key, framework[item][key])
                        }
                    }
                }
            })
        }

        if (option.defaultName) {
            this.setKeyValue("defaultName", option.defaultName)
        }

        if (option.formDataComponentKey) {
            this.setKeyValue("formDataComponentKey", option.formDataComponentKey)
        }

        if (option.formDataComponentDefaultValue) {
            this.setKeyValue("formDataComponentDefaultValue", option.formDataComponentDefaultValue)
        }

        if (option.formDataComponentChangeKeyEvent) {
            this.setKeyValue("formDataComponentChangeKeyEvent", option.formDataComponentChangeKeyEvent)
        }
        if (option.formDataComponentDisabled) {
            this.setKeyValue("formDataComponentDisabled", option.formDataComponentDisabled)
        }
    }

    /**
     * 替换defaultName值
     * @param config 
     */
    setKeyValue = (thisKey: string, config: { [key: string]: any; }) => {
        if (["defaultName", "formDataComponentKey", "formDataComponentDefaultValue", "formDataComponentChangeKeyEvent", "formDataComponentDisabled"].includes(thisKey)) {
            for (let key in config) {
                this[thisKey][key] = config[key]
            }
        }
    }

    /**
     * 获取配置中的 formDataComponentKey
     * @param componentName 
     * @returns 
     */
    getModelValueKeys(componentName: string) {
        const fck = this.formDataComponentKey[componentName] || this.formDataComponentKey.default
        if (Array.isArray(fck)) {
            return fck
        } else {
            return [fck]
        }
    }

    /**
     *  获取配置中的 formDataComponentChangeKeyEvent
     * @param componentName 
     * @param keys 
     * @returns 
     */
    getModelValueChangeEvents(componentName: string, keys: string[]) {
        const fcke = this.formDataComponentChangeKeyEvent[componentName]
        if (fcke) {
            if (Array.isArray(fcke)) {
                return keys.map((key, i) => {
                    if (i < fcke.length) {
                        return fcke[i]
                    } else {
                        return `onUpdate:${key}`
                    }
                })
            } else {
                return keys.map(() => fcke)
            }
        } else {
            return keys.map(key => `onUpdate:${key}`)
        }
    }

    /**
     * 获取配置中的 formDataComponentDefaultValue
     * @param componentName 
     * @param keys 
     * @returns 
     */
    getModelValueDefaultNullValues(componentName: string, keys: string[]) {
        const fcdv = this.formDataComponentDefaultValue[componentName] || null
        if (Array.isArray(fcdv) && fcdv.length) {
            return keys.map((_, i) => {
                if (i < fcdv.length) {
                    return fcdv[i]
                } else {
                    return null
                }
            })
        }
        return keys.map(() => fcdv);
    }

    /**
     * 获取配置中的 formDataComponentDisabled
     * @param componentName 
     * @returns 
     */
    getComponentDisabled(componentName: string) {
        const fcd = this.formDataComponentDisabled[componentName]
        return typeof fcd === "string" ? fcd : this.formDataComponentDisabled.default
    }
}


