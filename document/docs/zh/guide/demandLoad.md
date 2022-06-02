# 按需加载


组件本身就是按需使用不需要全局加载，但组件依赖ui库，如ui库未在全局加载，则使用ui库的组件无法找到。但可通过如下方式解决：

xxx.vue

```js
import { Input } from "ant-design-vue";
import { JsonLayout } from "json-layout";

// 同时引入ui库对应组件
JsonLayout.components = {Input}

export default {
  components: { JsonLayout, Input },
};
```