# 快速上手

## 安装


<CodeGroup>
  <CodeGroupItem title="NPM" active>

```bash
npm install --S vue-beast-form
```

  </CodeGroupItem>
</CodeGroup>

## 全局配置
main.js 确认使用的ui组件，以ant-design-vue为例子  [$beastForm详细说明](../global/beastForm.md)

```js
import { createApp } from 'vue'
import App from './App.vue'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import frameworks from 'vue-beast-form/lib/config/frameworks'

const app = createApp(App)

app.config.globalProperties.$beastForm = {
    base: 'ant-design-vue',
    frameworks: frameworks
}
app.use(antd);

...
```

## 使用


[参考在线示例](./demo.md)

[props介绍](../props/index.md)

