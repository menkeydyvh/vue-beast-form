# 组件

所有用vue方式开发并支持[vue compoment](https://v3.cn.vuejs.org/api/application-api.html#component) 的方式均为组件。但可以区分为[布局组件](#布局组件)和[表单组件](#表单组件)


## 布局组件
提供布局和一些布局相关的切换效果的组件

例如：栅格组件、提示框组件等

## 表单组件

方便给表单提供数据处理的组件

例如：输入框组件、单选组件、复选框组件等

问：如何成为一个表单组件？

**答：提供v-model:key**


```vue
<template>
    xxxx
</template>
<script>
export default defineComponent({
    name:"",
    props:['modelValue','disabled'],
    emits:['update:modelValue'],
    // 其他自己开发...
})
</script>
```
