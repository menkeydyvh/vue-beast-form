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

    constructor(options: ConfigOptionsType) {
        if (options.base) {
            if (framework[options.base]) {
                this.setKeyValue("defaultName", framework[options.base].defaultName)
                this.setKeyValue("formDataComponentKey", framework[options.base].formDataComponentKey)
                this.setKeyValue("formDataComponentDefaultValue", framework[options.base].formDataComponentDefaultValue)
                this.setKeyValue("formDataComponentChangeKeyEvent", framework[options.base].formDataComponentChangeKeyEvent)
            }
        }
        if (options.defaultName) {
            this.setKeyValue("defaultName", options.defaultName)
        }

        if (options.formDataComponentKey) {
            this.setKeyValue("formDataComponentKey", options.formDataComponentKey)
        }

        if (options.formDataComponentDefaultValue) {
            this.setKeyValue("formDataComponentDefaultValue", options.formDataComponentDefaultValue)
        }

        if (options.formDataComponentChangeKeyEvent) {
            this.setKeyValue("formDataComponentChangeKeyEvent", options.formDataComponentChangeKeyEvent)
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


