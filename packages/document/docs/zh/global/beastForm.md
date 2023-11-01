# $beastForm

$beastForm 用来告诉框架使用哪个框架的form和表单组件对应的一些配置项,同时也支持自定义配置form相关的配置项

**ant-design-vue为例子**

<CodeGroup>
  <CodeGroupItem title="JS" active>

```js{5-7}
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$beastForm = {
    base: '',
    frameworks:{}
}
...
```

  </CodeGroupItem>
  <CodeGroupItem title="TS">

```ts{3,6-8}
import { createApp } from 'vue'
import App from './App.vue'
import type { GlobalConfigType } from "vue-beast-form"

const app = createApp(App)
app.config.globalProperties.$beastForm =  {
    base: 'ant-design-vue',
    frameworks:{}
} as GlobalConfigType
...
```

  </CodeGroupItem>
</CodeGroup>

## 配置项

| 参数                      | 类型                      | 说明                          |
| ------------------------- | ------------------------- | ----------------------------- |
| base                      | string                    | 使用默认框架名称              |
| [frameworks](#frameworks) | GlobalConfigTypeFramework | 框架对应的配置,类型见下方介绍 |

## frameworks


```ts
import type { GlobalConfigTypeFramework } from 'vue-beast-form'

const frameworks:GlobalConfigTypeFramework = {
  "ant-design-vue":{
    baseConfig:{},
    model:{}
    defaultValue:{}
    modelEvent:{}
    disabled:{}
  }
}
```
快速查看字段说名：
[baseConfig](#baseConfig)、[model](#model)、[defaultValue](#defaultValue)、[modelEvent](#modelEvent)、[disabled](#disabled)


#### baseConfig
- 类型: {}
- 注意：下方key都是必填，如无值可设置为string默认值""
- 说明：跟form与formItem相关的基础配置

**下列用ant-design-vue的配置为值举栗子**
  
| key                    | 说明                           | 类型   | 值            |
| :--------------------- | :----------------------------- | :----- | :------------ |
| form                   | 框架form组件的名称             | string | a-form        |
| formPropsModel         | 框架form组件的数据对象属性     | string | model         |
| formItem               | 框架form组件的formItem名称     | string | a-form-item   |
| formItemPropName       | formItem对应model上的key       | string | name          |
| formItemPropLabel      | formItem对应标题label的key     | string | label         |
| formItemPropRules      | formItem对应验证规则的key      | string | rules         |
| formItemSlotTitle      | formItem对应标题label的插槽key | string | label         |
| formEventValidate      | form组件的验证事件             | string | validate      |
| formEventClearValidate | form组件的清除验证事件         | string | clearValidate |

#### model
- 类型: { [ComponentName: string]: string[] }
- 默认值： ['modelValue']
- 说明：组件对应的v-model:key中的key

**与默认值不一致时候需要配置**

```js{2-4}
{
    AInput: ['value'],
    ATransfer: ["selectedKeys", "targetKeys"],
    ...
}
```
#### defaultValue
- 类型: { [ComponentName: string]: any[] }
- 默认值： [null]
- 说明：组件对应的v-model:key中空值时候的默认值

**与默认值不一致时候需要配置**

```js{2-3}
{
    ATransfer: [[], []],
    ...
}
```
#### modelEvent
- 类型: { [ComponentName: string]: string[] }
- 默认值：['onUpdate:modelValue']
- 说明：组件对应的v-model:key中的事件

**与默认值不一致时候需要配置**

```js{2-3}
{
    ATransfer: ["onUpdate:selectedKeys", "onUpdate:targetKeys"],
    ...
}
```

#### disabled
- 类型: { [ComponentName: string]: string  }
- 默认值： 'disabled'
- 说明：组件对应的禁用key 有些组件是用disabled 有些组件是用readonly 或者其他

**与默认值不一致时候需要配置**

```js{2-3}
{
    组件名称: "readonly",
    ...
}
```
<br/>
<hr/>