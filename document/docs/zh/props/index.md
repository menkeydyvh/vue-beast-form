# 介绍

介绍整体 beast-form 提供的参数和方法

:::demo 
ant/easyForm
:::


## props

| 参数                         | 说明                    | 类型     | ts类型            |
| ---------------------------- | ----------------------- | -------- | ----------------- |
| [rule](./rule.md)            | 渲染布局使用的数组      | Array    | Array< RuleType > |
| [api](./api.md)(v-model:api) | 提供一个全局可绑定的api | Function | ApiType           |
| modelValue(v-model)          | 双向绑定的值            | {}       | any               |
| [option](./option.md)        | 提供一些设定            | {}       | PropsOptionType   |
| disabled                     | 禁用整个表单内的组件    | boolean  | Boolean           |

ts类型均可以使用如下方式获取

```ts
import type { ApiType, RuleType, PropsOptionType } from 'vue-beast-form'

...
```


## 事件

| 名称              | 说明                   | 参数                                        |
| ----------------- | ---------------------- | ------------------------------------------- |
| changeField       | 单独字段值修改时候回调 | （field: string, value: any, api: ApiType） |
| update:modelValue | 字段值修改时候回调     | （modelValue:{...}）                        |
| update:api        | 字段值修改时候回调     | （api:ApiType）                             |
| mounted           | 命周期render完成       | （api:ApiType）                             |
| unmounted         | 生命周期 组件注销      | 无                                          |