# 在线示例

当前示例使用 ant-design-vue 的在线示例

main.js

```js
import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

const app = createApp(App)
app.config.globalProperties.$beastForm = {
    base: 'ant-design-vue',
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
