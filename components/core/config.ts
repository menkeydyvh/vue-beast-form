interface DefaultName {
    form: string;
    formItem: string;
    formItemPropName: string;
    formItemPropLabel: string;
    formItemSlotTitle: string;
}

/**
 * form 组件名称
 */
const defaultName: DefaultName = {
    form: 'a-form',
    formItem: 'a-form-item',
    formItemPropName: 'name',
    formItemPropLabel: 'label',
    formItemSlotTitle: 'label',
}

/**
 * 表单组件定义 v-model 的 :key
 */
const formDataComponentKey = {
    // 这个是给自定义组件用的
    default: 'modelValue',
    // ant
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
}

/**
 * 表单组件定义 v-model 的 :key 对应的默认值 默认值null
 * PS：如果有特殊默认值需要配置出来，对应formDataComponentKey的值的格式
 */
const formDataComponentDefaultValue = {
    // 这个是给自定义组件用的
    // default: null,
    // ant
    ATransfer: [[], []],
}


/**
 * 表单组件定义 v-model 的 :key 对应的事件名称 
 * PS：如果组件默认值与默认事件监听有出入需要默认配置
 */
const formDataComponentChangeKeyEvent = {
    // 这个是给自定义组件用的
    // default: 'onUpdate:modelValue',
    // ant
    AInputNumber: 'onChange',
}

/**
 * 替换defaultName值
 * @param config 
 */
const updateDefaultName = (config: DefaultName) => {
    for (let key in config) {
        defaultName[key] = config[key]
    }
}

/**
 * 添加更多配置
 * @param name
 * @param keys 
 * @param events 
 * @param defaultValues 
 */
const setFormDataComponent = (name: string, keys: string | string[], events: string | string[], defaultValues?: any) => {
    formDataComponentChangeKeyEvent[name] = keys
    if (typeof keys === typeof events) {
        if (Array.isArray(keys)) {
            if (keys.length != events.length) {
                throw new Error('keys and events different lengths')
            }
        }
        formDataComponentChangeKeyEvent[name] = events;
    } else {
        throw new Error('keys and events different typeof')
    }
    if (defaultValues !== null && defaultValues !== undefined) {
        if (typeof keys === typeof defaultValues) {
            if (Array.isArray(keys)) {
                if (keys.length != defaultValues.length) {
                    throw new Error('keys and defaultValues different lengths')
                }
            }
            formDataComponentDefaultValue[name] = defaultValues;
        } else {
            throw new Error('keys and defaultValues different typeof')
        }
    }
}

export {
    defaultName,
    formDataComponentKey,
    formDataComponentChangeKeyEvent,
    formDataComponentDefaultValue,
    updateDefaultName,
    setFormDataComponent,
}


