import { getCurrentInstance } from 'vue'
import type { DefaultName, ConfigOptionsType } from '../types'
import { framework } from './framework'

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
                this.setKeyValue("defaultName", framework[option.base].defaultName)
                this.setKeyValue("formDataComponentKey", framework[option.base].formDataComponentKey)
                this.setKeyValue("formDataComponentDefaultValue", framework[option.base].formDataComponentDefaultValue)
                this.setKeyValue("formDataComponentChangeKeyEvent", framework[option.base].formDataComponentChangeKeyEvent)
            }
        }
        if (option.frameworks) {
            option.frameworks.forEach((item) => {
                if (item != option.base && framework[item]) {
                    if (!option.base) {
                        option.base = item
                        this.setKeyValue("defaultName", framework[item].defaultName)
                    }
                    this.setKeyValue("formDataComponentKey", framework[item].formDataComponentKey)
                    this.setKeyValue("formDataComponentDefaultValue", framework[item].formDataComponentDefaultValue)
                    this.setKeyValue("formDataComponentChangeKeyEvent", framework[item].formDataComponentChangeKeyEvent)
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
    }

    /**
     * 替换defaultName值
     * @param config 
     */
    setKeyValue = (
        thisKey: "defaultName" | "formDataComponentKey" | "formDataComponentDefaultValue" | "formDataComponentChangeKeyEvent",
        config: {
            [key: string]: any;
        }) => {
        for (let key in config) {
            this[thisKey][key] = config[key]
        }
    }
}


