# 介绍
## 安装


<CodeGroup>
  <CodeGroupItem title="NPM" active>

```bash
npm install --S json-layout
```

  </CodeGroupItem>
</CodeGroup>

## 配置
main.js
```js
app.config.globalProperties.$jsonLayout = {
    baseUi: 'ant-design-vue'
}
```

## 使用



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

 <CodeGroupItem title="JS" active>
  
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


## 属性

|    属性    |   说明   |    值类型    |       默认值      |
|    ---     | ---     |     ---      |      ---         |
| rule    |  用于布局[详细说明](./rule.md)  | Array[]  |  -  |
| modelValue（v-model）  | 双向绑定表单输入数据  |  any | - |
| option  |  [详细说明](./option.md) |  - | - |
| api (v-model:api) |  [详细说明](./api.md)  | - | - |
| isForm  | 顶层渲染true:form,false:div  | Boolean | true |
| disabled  | 禁用表单  |   Boolean | false |