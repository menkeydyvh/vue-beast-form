# 全局配置

$jsonLayout 用来告诉框架使用哪个框架的form和表单组件对应的一些配置项,同时也支持自定义配置form相关的配置项

<CodeGroup>
  <CodeGroupItem title="JS" active>

```js{5-7}
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.config.globalProperties.$jsonLayout = {
    base: 'ant-design-vue'
}
...
```

  </CodeGroupItem>
  <CodeGroupItem title="TS">

```ts{3,6-8}
import { createApp } from 'vue'
import App from './App.vue'
import type { GlobalConfigType } from "json-layout"

const app = createApp(App)
app.config.globalProperties.$jsonLayout =  {
    base: 'ant-design-vue'
} as GlobalConfigType
...
```

  </CodeGroupItem>
</CodeGroup>

## 配置项

| 参数                            | 类型     | 说明                                         |
| ------------------------------- | -------- | -------------------------------------------- |
| base                            | string   | [查看说明](#base)                            |
| frameworks                      | string[] | [查看说明](#frameworks)                      |
| defaultName                     | object   | [查看说明](#defaultname)                     |
| formDataComponentKey            | object   | [查看说明](#formdatacomponentkey)            |
| formDataComponentDefaultValue   | object   | [查看说明](#formdatacomponentdefaultvalue)   |
| formDataComponentChangeKeyEvent | object   | [查看说明](#formdatacomponentchangekeyevent) |

#### base
- 类型: string <Badge text="建议必填" />
- 说明：填写使用的主框架名称
- 支持情况: ant-design-vue 

#### frameworks
- 类型: []string 
- 说明：填入使用的框架名称，方便导入默认配置
- 例如：["element-ui","ant-design-vue"]

#### defaultName
- 类型: Object
- 注意：**base** 没配置时这个配置是必然要设置的否则form无法被构建出来
- 说明：跟form与formItem相关的基础配置
- 细项：下列用ant-design-vue为例
  
| key                    | 说明                           | 类型   | 值            |
| :--------------------- | :----------------------------- | :----- | :------------ |
| form                   | 框架form组件的名称             | string | a-form        |
| formItem               | 框架form组件的formItem名称     | string | a-form-item   |
| formItemPropName       | formItem对应model上的key       | string | name          |
| formItemPropLabel      | formItem对应标题label的key     | string | label         |
| formItemSlotTitle      | formItem对应标题label的插槽key | string | label         |
| formEventValidate      | form组件的验证事件             | string | validate      |
| formEventClearValidate | form组件的清除验证事件         | string | clearValidate |

#### formDataComponentKey
- 类型: Object = { [ComponentName: string]: string | string[] }
- 默认值：{default: 'modelValue'}
- 说明：组件对应的v-model:key中的key
- 注意 **与默认值不一致时候需要配置**
- 例如：
```js{2-4}
{
    default: 'modelValue',
    AInput: 'value',
    ATransfer: ["selectedKeys", "targetKeys"],
    ...
}
```
#### formDataComponentDefaultValue
- 类型: Object = { [ComponentName: string]: any }
- 默认值：{default: null}
- 说明：组件对应的v-model:key中空值时候的默认值
- 注意 **与默认值不一致时候需要配置**
- 例如: 
```js{2-3}
{
    default: null,
    ATransfer: [[], []],
    ...
}
```
#### formDataComponentChangeKeyEvent
- 类型: Object = { [ComponentName: string]: string | string[] }
- 默认值：{default: 'onUpdate:modelValue'}
- 说明：组件对应的v-model:key中的事件
- 注意 **与默认值不一致时候需要配置**
- 例如：
```js{2-3}
{
    default:"onUpdate:modelValue",
    ATransfer: ["onUpdate:selectedKeys", "onUpdate:targetKeys"],
    ...
}
```

注意：如果formDataComponentKey配置的是数组 [formDataComponentDefaultValue、formDataComponentChangeKeyEvent] **必定也是数组** ,同时顺序是绑定的