import type { DefaultName } from '../types'

const defaultConfig = {
    // 对应ui框架
    'ant-design-vue': {
        defaultName: {
            form: 'a-form',
            formItem: 'a-form-item',
            formItemPropName: 'name',
            formItemPropLabel: 'label',
            formItemSlotTitle: 'label',
        },
        formDataComponentKey: {
            AAutoComplete: 'value',
            ACascader: 'value',
            ACheckboxGroup: 'value',
            ADatePicker: 'value',
            ARangePicker: 'value',
            AInput: 'value',
            ATextarea: 'value',
            AInputPassword: 'value',
            AInputNumber: 'value',
            AMentions: 'value',
            ARadioGroup: 'value',
            ARate: 'value',
            ASelect: 'value',
            ASlider: 'value',
            ATimePicker: 'value',
            ATimeRangePicker: 'value',
            ATreeSelect: 'value',
            ACheckbox: 'checked',
            AChecked: 'checked',
            ARadio: 'checked',
            ASwitch: 'checked',
            ATransfer: ["selectedKeys", "targetKeys"],
            AUpload: 'fileList',
            AUploadDragger: "fileList",
        },
        formDataComponentDefaultValue: {
            ATransfer: [[], []],
        },
        formDataComponentChangeKeyEvent: {
            AInputNumber: 'onChange',
        }
    }
    // 后续继续加框架
}


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
        [key: string]: string | string[];
    } = {
            default: 'modelValue'
        }

    /**
     * 表单组件定义 v-model 的 :key 对应的默认值 默认值null
     * PS：如果有特殊默认值需要配置出来，对应formDataComponentKey的值的格式
     */
    public formDataComponentDefaultValue: {
        [key: string]: any;
    } = {}

    /**
     * 表单组件定义 v-model 的 :key 对应的事件名称 
     * PS：如果组件默认值与默认事件监听有出入需要默认配置
     */
    public formDataComponentChangeKeyEvent: {
        [key: string]: string | string[];
    } = {}

    constructor() {
        for (const uiFramework in defaultConfig) {
            this.formDataComponentKey = {
                ...this.formDataComponentKey,
                ...defaultConfig[uiFramework].formDataComponentKey
            }
            this.formDataComponentDefaultValue = {
                ...this.formDataComponentDefaultValue,
                ...defaultConfig[uiFramework].formDataComponentDefaultValue
            }
            this.formDataComponentChangeKeyEvent = {
                ...this.formDataComponentChangeKeyEvent,
                ...defaultConfig[uiFramework].formDataComponentChangeKeyEvent
            }
        }

        // 默认现初始化这个框架
        this.updateDefaultName(defaultConfig['ant-design-vue'].defaultName)
    }

    /**
     * 替换defaultName值
     * @param config 
     */
    updateDefaultName = (config: DefaultName) => {
        for (let key in config) {
            this.defaultName[key] = config[key]
        }
    }

    /**
     * 添加更多配置
     * @param name
     * @param keys 
     * @param events 
     * @param defaultValues 
     */
    setFormDataComponent = (name: string, keys: string | string[], events?: string | string[], defaultValues?: any) => {
        this.formDataComponentKey[name] = keys;
        if (defaultValues !== null && defaultValues !== undefined) {
            if (typeof keys === typeof events) {
                if (Array.isArray(keys)) {
                    if (keys.length != events.length) {
                        throw new Error('keys and events different lengths')
                    }
                }
                this.formDataComponentChangeKeyEvent[name] = events;
            } else {
                throw new Error('keys and events different typeof')
            }
        }
        if (defaultValues !== null && defaultValues !== undefined) {
            if (typeof keys === typeof defaultValues) {
                if (Array.isArray(keys)) {
                    if (keys.length != defaultValues.length) {
                        throw new Error('keys and defaultValues different lengths')
                    }
                }
                this.formDataComponentDefaultValue[name] = defaultValues;
            } else {
                throw new Error('keys and defaultValues different typeof')
            }
        }
    }
}


