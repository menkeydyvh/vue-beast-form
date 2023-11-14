# rule

## 简介

利用这个JSON规则来生成对应布局和相关层级结构，同时可针对style设置className设置




## ts中使用

```ts
import type { RuleType,RuleChlidren,ChildrenFn } from "vue-beast-form";

const rule = ref<RuleType[]>([
  {
    // 引入type方便书写
  }
]) 
```

## 字段介绍

| 名称                        | 基础类型或者TS自定义类型            | 说明                                                                                           |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| [type](#type示例)           | string <Badge text="必填" />        | 用于生成对应组件的名称                                                                         |
| [props](#props示例)         | Record<string,any>                  | 组件的props                                                                                    |
| [field](#field示例)         | string                              | 在api中用来做搜索的key,表单组件时用来记录值得key                                               |
| [title](#title示例)         | string &#124; RuleType &#124; false | 为formItem的label值<br/>string：直接展示<br/>rule：渲染成插槽展示<br/>false：不包裹在form-item |
| [model](#vmodel示例)        | string[]                            | 组件v-model:key 对应的key 监听多个v-model时可为数组                                            |
| [defaultValue](#vmodel示例) | any[]                               | 组件v-model:key="value" 对应的value的默认空值,有些组件默认空值需要配置为[]的情况可进行配置使用 |
| [value](#value示例)         | any                                 | 组件值                                                                                         |
| [validate](#validate示例)   | Array                               | 组件验证规则,例如：[{required: true, message: '请输入内容'}]                                   |
| [class](#sca示例)           | string &#124; string[]              | 针对组件设置className                                                                          |
| [style](#sca示例)           | string &#124; Record<string,any>    | 针对组件设置style                                                                              |
| [attrs](#sca示例)           | Record<string,string>               | 针对组件设置attr                                                                               |
| [children](#children示例)   | RuleChlidren[] &#124; ChildrenFn    | 子集渲染，使用注意事项在下方示例中                                                             |
| [slot](#slot示例)           | string                              | children中渲染在指定插槽下                                                                     |
| [display](#display示例)     | Boolean                             | 是否显示                                                                                       |
| [on](#事件处理示例)         | Record<string,Function>             | 组件事件监听，on事件监听的事件会默认在最后一个参数绑定一个api对象方便使用api                   |


#### type示例

:::demo 
ant/ruleType
:::

#### props示例

:::demo 
ant/ruleProps
:::

 #### field示例

:::demo 
ant/easyForm
:::
 #### title示例

:::demo 
ant/ruleTitle
:::

#### value示例

:::demo 
ant/ruleValue
:::

 #### vModel示例
model和defaultValue

:::demo 
ant/ruleVmodel
:::

 #### validate示例

:::demo 
ant/ruleValidate
:::
 #### sca示例

style、class、attrs 示例

**注意有formItem层级时候 外层对应的是formItem props对应的是设置组件**

:::demo 
ant/ruleStyle
:::

#### children示例

使用**对象函数**方式渲染： 1.必须返回一个数组  2.无法进行内容的filed的搜索  3.如无特殊需要请直接使用数组方式渲染

:::demo 
ant/ruleChildren
:::

#### slot示例

:::demo 
ant/ruleSlot
:::
#### display示例

:::demo 
ant/ruleDisplay
:::

#### 事件处理示例

:::demo 
ant/ruleOn
:::
