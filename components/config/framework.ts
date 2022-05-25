export const framework = {
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
