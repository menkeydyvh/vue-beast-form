# element-plus

## frameworks.js
与main.js同层建立一个 frameworks.js 用来存放配置
```js
export default {
    'element-plus': {
        defaultName: {
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
        formDataComponentKey: {},
        formDataComponentDefaultValue: {
            ElCheckboxGroup: [],
            ElTransfer: [],
        },
        formDataComponentChangeKeyEvent: {
        },
        formDataComponentDisabled: {},
    },
}
```

## main.js

```js
import { createApp } from 'vue'
import App from './app.vue'

import frameworks from './frameworks.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(Antd)

// 可以抽出来引入
app.config.globalProperties.$beastForm = {
    base: 'element-plus',
    frameworks: frameworks,
}

app.mount('#app')
```

## demo.vue

:::demo 
elePlus/form
:::
