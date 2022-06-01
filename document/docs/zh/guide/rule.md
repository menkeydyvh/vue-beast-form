# rule

## 简介

利用这个JSON规则来生成对应布局和相关层级结构，同时可针对style设置className设置

## 代码示例

:::demo 
ant/easyRule
:::


## 字段介绍
下列为规则字段
### type 
- 类型：String <Badge text="必填" />
- 说明：用于生成对应组件的名称。 
- 例如：div、a-input
### props
- 类型：Object 
- 说明：组件的props
### field
- 类型：String
- 说明：
  - 在api中用来做搜索的key
  - 表单组件时用来记录值得key
### title
- 类型：String | rule <Badge text="表单组件时使用" />
- 说明：为formItem的label值
  - string ： 直接展示
  - rule ：渲染成插槽展示
### vModelKey
- 类型：String | []String <Badge text="表单组件时使用" />
- 默认值：modelValue
- 说明：组件v-model:key 对应的key 监听多个v-model时可为数组  
### vModelKeyDefaultValue
- 类型：String | []String <Badge text="表单组件时使用" />
- 默认值 null
- 说明：组件v-model:key="value" 对应的value的默认空值,有些组件默认空值需要配置为[]的情况可进行配置使用
### value
- 类型：any <Badge text="表单组件时使用" />
- 说明：组件默认值
### validate
- 类型：Array <Badge text="表单组件时使用" />
- 说明：组件验证规则
### native
- 类型：Boolean <Badge text="表单组件时使用" />
- 说明：是否渲染formItem
### class
- 类型：String | Array
- 说明：针对组件设置className
### style
- 类型：String | Object
- 说明：针对组件设置style
### attrs
- 类型：String | Object
- 说明：针对组件设置attr
### children
- 类型：[]rule | []string
- 说明：子集渲染,默认渲染在default插槽
### slot
- 类型：String <Badge text="渲染在插槽时使用" />
- 说明：如果需要渲染在指定插槽下请指定配置
### display
- 类型："if" | "show"
- 说明：对应v-if和v-show的值为true的效果隐藏效果
### directives
- 类型：Array
- 说明：指令配置
### on
- 类型：Object
- 说明：组件事件监听
