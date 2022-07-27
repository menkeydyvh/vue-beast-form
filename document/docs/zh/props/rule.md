# rule

## 简介

利用这个JSON规则来生成对应布局和相关层级结构，同时可针对style设置className设置


## 字段介绍

TS开发中便捷提示

<CodeGroup>
  <CodeGroupItem title="TS" active>

```ts
import type { RuleType } from "vue-beast-form";

const rule = ref<RuleType[]> = [
  {
    // 引入type方便书写
  }
]
```

  </CodeGroupItem>
</CodeGroup>

| 名称                                 | 基础类型或者TS自定义类型          | 说明                                                                                           |
| ------------------------------------ | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| [type](#type示例)                    | String <Badge text="必填" />      | 用于生成对应组件的名称                                                                         |
| [props](#props示例)                  | Object                            | 组件的props                                                                                    |
| [field](#field示例)                  | String                            | 在api中用来做搜索的key,表单组件时用来记录值得key                                               |
| [title](#title示例)                  | String, rule, false               | 为formItem的label值<br/>string：直接展示<br/>rule：渲染成插槽展示<br/>false：不包裹在form-item |
| [vModelKey](#vmodel示例)             | String, Array&lt;String&gt;       | 组件v-model:key 对应的key 监听多个v-model时可为数组                                            |
| [vModelKeyDefaultValue](#vmodel示例) | String, Array&lt;String&gt;       | 组件v-model:key="value" 对应的value的默认空值,有些组件默认空值需要配置为[]的情况可进行配置使用 |
| [value](#value示例)                  | any                               | 组件值                                                                                         |
| [validate](#validate示例)            | Array                             | 组件验证规则,例如：[{required: true, message: '请输入内容'}]                                   |
| [class](#sca示例)                    | String, Array                     | 针对组件设置className                                                                          |
| [style](#sca示例)                    | String, Object                    | 针对组件设置style                                                                              |
| [attrs](#sca示例)                    | Object                            | 针对组件设置attr                                                                               |
| [children](#children示例)            | Array&lt;String&#124;RuleType&gt; | 子集渲染,默认渲染在default插槽                                                                 |
| [slot](#slot示例)                    | String                            | 渲染在指定插槽下                                                                               |
| [display](#display示例)              | Boolean                           | 是否显示                                                                                       |
| [directives](#事件处理示例)          | Array&lt;Directives&gt;           | 指令配置                                                                                       |
| [on](#事件处理示例)                  | Object                            | 组件事件监听，on事件监听的事件会默认在最后一个参数绑定一个api对象方便使用api                   |
| [emits](#事件处理示例)               | Array&lt;EmitType&gt;             | 会抛出事件到最顶层                                                                             |


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
vModelKey和vModelKeyDefaultValue

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

