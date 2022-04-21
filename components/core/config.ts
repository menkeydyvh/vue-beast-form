interface AddConfigType {
    vModelKey: string;
    names: string[];
}

/**
 * form 组件名称
 */
const defaultName: any = {
    form: 'a-form',
    formItem: 'a-form-item',
    formItemPropName: 'name',
    formItemPropLabel: 'label',
    formItemSlotTitle: 'label',
}


/**
 * 表单组件定义 v-model 的 :key
 */
const formComponentConfig: any = {
    // 这个是给自定义组件用的
    default: 'modelValue',
}


/**
 * 表单组件定义 v-model 的 :key 对应的事件名称
 */
const formComponentValueChangeConfig: any = {
    // 这个是给自定义组件用的
    default: 'onUpdate:modelValue',
}

// 针对ant相关的数据录入组件配置v-model
const ant: AddConfigType[] = [
    {
        vModelKey: "value",
        names: [
            "AAutoComplete",
            "ACascader",
            "ACheckboxGroup",
            "ADatePicker",
            "ARangePicker",
            "AInput",
            "ATextarea",
            "AInputPassword",
            "AInputNumber",
            "AMentions",
            "ARadioGroup",
            "ARate",
            "ASelect",
            "ASlider",
            "ATimePicker",
            "ATimeRangePicker",
            "ATreeSelect",
        ],
    },
    {
        vModelKey: "checked",
        names: [
            "ACheckbox",
            "AChecked",
            "ARadio",
            "ASwitch",
        ]
    }
]

/**
 * 按vue3的规范可以直接处理
 * @param config 
 */
const addFormComponentConfig = (config: AddConfigType[]) => {
    config.forEach(item => {
        item.names.forEach(k => {
            formComponentConfig[k] = item.vModelKey
            formComponentValueChangeConfig[k] = k === 'AInputNumber' ? 'onChange' : `onUpdate:${item.vModelKey}`
        })
    })
}


addFormComponentConfig(ant);

// 这个组件没有按照规范处理
if (formComponentValueChangeConfig.AInputNumber) {
    formComponentValueChangeConfig.AInputNumber = 'onChange'
}


export {
    defaultName,
    formComponentConfig,
    formComponentValueChangeConfig,
    addFormComponentConfig,
}


