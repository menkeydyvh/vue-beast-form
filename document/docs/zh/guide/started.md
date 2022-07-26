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
main.js 确认使用的ui组件  [详细说明](../global/beastForm.md)

```js{6-8}
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$beastForm = {
    base: 'ant-design-vue'
}
...
```

## 使用


[参考在线示例](./demo.md)

[props介绍](../props/index.md)

