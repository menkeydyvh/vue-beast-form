# 介绍

介绍整体 beast-form 提供的参数和方法

:::demo 
ant/easyForm
:::

## props

| 参数                         | 说明                    | 类型     | ts类型                |
| ---------------------------- | ----------------------- | -------- | --------------------- |
| [rule](./rule.md)            | 渲染布局使用的数组      | Array    | Array&lt;RuleType&gt; |
| [api](./api.md)(v-model:api) | 提供一个全局可绑定的api | Function | ApiType               |
| modelValue(v-model)          | 双向绑定的值            | {}       | any                   |
| [option](./option.md)        | 提供一些设定            | {}       | PropsOptionType       |
| [name](./api.md#getapi)      | 开启缓存当前api         | string   | string                |
| disabled                     | 禁用整个表单内的组件    | boolean  | Boolean               |

## 事件

| 名称              | 说明                   | 参数      |
| ----------------- | ---------------------- | --------- |
| changeField       | 单独字段值修改时候回调 | (值,字段) |
| update:modelValue | v-model时使用          | {}        |
| update:api        | v-model:api时使用      | ApiType   |
| mounted           | 命周期render完成       | -         |
| unmounted         | 生命周期 组件注销      | -         |