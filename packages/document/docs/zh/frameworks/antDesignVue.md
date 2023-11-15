# ant-design-vue

## frameworks.js
与main.js同层建立一个 frameworks.js 用来存放配置
```js
export default {
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
```

## main.js

```js
import { createApp } from 'vue'
import App from './app.vue'

import frameworks from './frameworks.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

const app = createApp(App)
app.use(Antd)

// 可以抽出来引入
app.config.globalProperties.$beastForm = {
    base: 'ant-design-vue',
    frameworks: frameworks,
}

app.mount('#app')
```

## demo.vue


:::demo 
ant/form
:::
