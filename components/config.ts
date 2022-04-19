/**
 * form 组件名称
 */
export const defaultName:any = {
    form: 'a-form',
    formItem: 'a-form-item',
    formItemPropName: 'name',
    formItemPropLabel: 'label',
}

/**
 * 表单组件定义 v-model 的 :key
 */
export const formComponentConfig: any = {
    // 这个是给自定义组件用的
    default: 'modelValue',
    // ant 框架组件
    AAutoComplete: 'value',
    ACascader: 'value',
    ACheckbox: 'checked',
    ACheckboxGroup: 'value',
    ADatePicker: 'value',
    ARangePicker: 'value',
    AInput: 'value',
    ATextarea: 'value',
    AInputPassword: 'value',
    AInputNumber: 'value',
    AMentions: 'value',
    AChecked: 'checked',
    ARadioGroup: 'value',
    ARate: 'value',
    ASelect: 'value',
    ASlider: 'value',
    ASwitch: 'checked',
    ATimePicker: 'value',
    ATimeRangePicker: 'value',
    ATransfer: 'targetKeys',
    ATreeSelect: 'value',
}
