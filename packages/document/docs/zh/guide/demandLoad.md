# 按需加载


组件本身就是按需使用不需要全局加载，但组件依赖ui库，如ui库未在全局加载，则使用ui库的组件无法找到。但可通过如下方式解决：

xxx.vue

```js
import { defineComponent } from "vue";
import { Input } from "ant-design-vue";
import { components } from "vue-beast-form";

// 按需引入ui库对应组件
components({Input})

export default defineComponent({
  setup(){

    // 继续编写代码
  }
});
```