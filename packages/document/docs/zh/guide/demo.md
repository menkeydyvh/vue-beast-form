# 在线示例

当前示例使用 ant-design-vue 的在线示例

main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// 这是作者自己调试适合适配的三个框架配置 查看如何配置请看$beastForms说明
import  { antDesignVue, elementPlus, vant }  from 'vue-beast-form/esm/config/frameworks'

const app = createApp(App)
app.config.globalProperties.$beastForm = {
    base: 'ant-design-vue',
    frameworks: { ...antDesignVue, ...elementPlus, ...vant } ,
}
app.use(Antd)
...
```



## div示例

:::demo 
ant/easyDiv
:::


## form示例

:::demo 
ant/easyForm
:::
