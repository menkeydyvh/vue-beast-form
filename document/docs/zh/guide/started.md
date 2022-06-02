# 快速上手

## 安装


<CodeGroup>
  <CodeGroupItem title="NPM" active>

```bash
npm install --S json-layout
```

  </CodeGroupItem>
</CodeGroup>

## 全局配置
main.js 确认使用的ui组件  [详细说明](./config.md)

```js{6-8}
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$jsonLayout = {
    base: 'ant-design-vue'
}
...
```

## 使用
xxx.vue
<CodeGroup>
  <CodeGroupItem title="TS" active>

```vue
<template>
    <json-layout v-model:api="jApi" v-model="value" :rule="rule" :option="option" />
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import JsonLayout from "json-layout";
import type { RuleType, ApiFnType, PropsOptionType } from "json-layout/lib/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref<ApiFnType>(),      
      rule = ref<RuleType[]>([]),
      option = ref<PropsOptionType>({}),  
      value = ref<any>();
    return {
      jApi,
      value,
      rule,
      option,
    };
  },
});
</script>
```

 </CodeGroupItem>

 <CodeGroupItem title="JS">
  
```vue
<template>
    <json-layout v-model:api="jApi" v-model="value" :rule="rule" :option="option" />
</template>
<script>
import { defineComponent, ref } from "vue";
import JsonLayout from "json-layout";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref(),      
      rule = ref([]),
      option = ref({}),  
      value = ref();
    return {
      jApi,
      value,
      rule,
      option,
    };
  },
});
</script>
```

 </CodeGroupItem>
</CodeGroup>


## 参数

| 属性                  | 说明                           | 值类型  | 默认值 |
| --------------------- | ------------------------------ | ------- | ------ |
| rule                  | [详细说明](../props/rule.md)   | Array[] | -      |
| option                | [详细说明](../props/option.md) | -       | -      |
| api (v-model:api)     | [详细说明](../props/api.md)    | -       | -      |
| modelValue（v-model） | 双向绑定表单输入数据           | any     | -      |
| isForm                | 顶层渲染true:form,false:div    | Boolean | true   |
| disabled              | 禁用表单                       | Boolean | false  |