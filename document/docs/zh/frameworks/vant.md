# vant

## frameworks.js
与main.js同层建立一个 frameworks.js 用来存放配置
```js
export default {
    "vant": {
        defaultName: {
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
        formDataComponentKey: {
            "van-calendar": 'show',
            "van-popup": 'show',
        },
        formDataComponentDefaultValue: {
            "van-checkbox-group": [],
            "van-number-keyboard": ''
        }
    }
}
```

## main.js

```js
import { createApp } from 'vue'
import App from './app.vue'

import frameworks from './frameworks.vue'
import Vant from 'vant';
import 'vant/lib/index.css';

const app = createApp(App)
app.use(Antd)

// 可以抽出来引入
app.config.globalProperties.$beastForm = {
    base: 'vant',
    frameworks: frameworks,
}

app.mount('#app')
```

## demo.vue

提交后查看控制台，vant有些中间处理杂项比较多但需要的数据都已能正常获取，请在最终筛选出需要使用的值把

**移动端框架请切换到移动模拟器或者手机上测试**

:::demo 
vant/form
:::
