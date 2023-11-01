import type { GlobalConfigTypeFramework } from '../types'


export const antDesignVue: GlobalConfigTypeFramework = {
    'ant-design-vue': {
        baseConfig: {
            form: 'a-form',
            formPropsModel: 'model',
            formItem: 'a-form-item',
            formItemPropName: 'name',
            formItemPropLabel: 'label',
            formItemPropRules: 'rules',
            formItemSlotTitle: 'label',
            formEventValidate: 'validate',
            formEventClearValidate: 'clearValidate',
        },
        model: {
            AAutoComplete: ['value'],
            ACascader: ['value'],
            ACheckboxGroup: ['value'],
            ADatePicker: ['value'],
            ARangePicker: ['value'],
            AInput: ['value'],
            ATextarea: ['value'],
            AInputPassword: ['value'],
            AInputNumber: ['value'],
            AMentions: ['value'],
            ARadioGroup: ['value'],
            ARate: ['value'],
            ASelect: ['value'],
            ASlider: ['value'],
            ATimePicker: ['value'],
            ATimeRangePicker: ['value'],
            ATreeSelect: ['value'],
            ACheckbox: ['checked'],
            AChecked: ['checked'],
            ARadio: ['checked'],
            ASwitch: ['checked'],
            ATransfer: ["targetKeys"],
            AUpload: ['fileList'],
            AUploadDragger: ["fileList"],
        },
        defaultValue: {
            ATransfer: [[]],
        },
        modelEvent: {},
        disabled: {
            ACollapsePanel: ""
        },
    },
}

export const elementPlus: GlobalConfigTypeFramework = {
    'element-plus': {
        baseConfig: {
            form: 'el-form',
            formPropsModel: 'model',
            formItem: 'el-form-item',
            formItemPropName: 'prop',
            formItemPropLabel: 'label',
            formItemPropRules: 'rules',
            formItemSlotTitle: 'label',
            formEventValidate: 'validate',
            formEventClearValidate: 'clearValidate',
        },
        model: {},
        defaultValue: {
            ElCheckboxGroup: [[]],
            ElTransfer: [[]],
        },
        modelEvent: {},
        disabled: {},
    },
}

export const vant: GlobalConfigTypeFramework = {
    "vant": {
        baseConfig: {
            form: 'van-form',
            formPropsModel: '',
            formItem: '',
            formItemPropName: '',
            formItemPropLabel: '',
            formItemPropRules: '',
            formItemSlotTitle: '',
            formEventValidate: 'validate',
            formEventClearValidate: 'resetValidation',
        },
        model: {
            "van-calendar": ['show'],
            "van-popup": ['show'],
        },
        defaultValue: {
            "van-checkbox-group": [[]],
            "van-number-keyboard": ['']
        },
        modelEvent: {},
        disabled: {},
    }
}