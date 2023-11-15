# api

提供获取、设置、验证的一些相关方法 [api例子](#demo)

## ts中使用
```ts
import type { ApiType } from "vue-beast-form";

const api = ref<ApiType>()
```


## field介绍

用来指向调用api的位置

## setValue

用于给表单组件设置值

| 参数  | 必填 | 类型   | 说明                                                 |
| ----- | ---- | ------ | ---------------------------------------------------- |
| field | 是   | string | 规则中的filed                                        |
| value | 是   | any    | 值                                                   |
| key   | 否   | string | 当值是对象且只想修改对象中的某个值可传入这个值的name |

## setClass

用于设置class

| 参数  | 必填 | 类型                 | 说明          |
| ----- | ---- | -------------------- | ------------- |
| field | 是   | string               | 规则中的filed |
| value | 是   | string&#124;string[] | 值            |

## setStyle

用于设置style

| 参数  | 必填 | 类型                    | 说明          |
| ----- | ---- | ----------------------- | ------------- |
| field | 是   | string                  | 规则中的filed |
| value | 是   | string&#124;{key:value} | 值            |

## setAttrs

用于设置attrs

| 参数  | 必填 | 类型        | 说明          |
| ----- | ---- | ----------- | ------------- |
| field | 是   | string      | 规则中的filed |
| attrs | 是   | {key:value} | 值            |

## setProps

用于设置props 某个key的值

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 是   | string | 规则中的filed |
| key   | 是   | string | props的key    |
| value | 是   | any    | 值            |


## setFormItemClass

用于设置formItem的class

| 参数  | 必填 | 类型                 | 说明          |
| ----- | ---- | -------------------- | ------------- |
| field | 是   | string               | 规则中的filed |
| value | 是   | string&#124;string[] | 值            |



## setFormItemStyle

用于设置formItem的style

| 参数  | 必填 | 类型                    | 说明          |
| ----- | ---- | ----------------------- | ------------- |
| field | 是   | string                  | 规则中的filed |
| value | 是   | string&#124;{key:value} | 值            |

## setDisplay
设置隐藏显示  false为隐藏

| 参数    | 必填 | 类型    | 说明          |
| ------- | ---- | ------- | ------------- |
| field   | 是   | string  | rule中的filed |
| display | 是   | boolean | 值            |

## setDisabled
设置禁用 true为禁用

| 参数     | 必填 | 类型    | 说明          |
| -------- | ---- | ------- | ------------- |
| field    | 是   | string  | rule中的filed |
| disabled | 是   | boolean | 值            |

## getFormData
获取表单数据

| 参数  | 必填 | 类型   | 说明                                    |
| ----- | ---- | ------ | --------------------------------------- |
| field | 否   | string | 表单收集中的收集字段key，不填则默认全部 |

**返回值：filed未填写值为{...}、有填写值为对应的结果值**


## resetFormData
重置表单数据，重置回表单初始化时候的数据

| 参数  | 必填 | 类型   | 说明                                    |
| ----- | ---- | ------ | --------------------------------------- |
| field | 否   | string | 表单收集中的收集字段key，不填则默认全部 |

## validate
验证表单

| 参数     | 必填 | 类型                 | 说明                         |
| -------- | ---- | -------------------- | ---------------------------- |
| callback | 是   | function             | 验证结果                     |
| fields   | 否   | string&#124;string[] | rule中的filed,默认整表单验证 |

## clearValidate
清空验证结果

| 参数   | 必填 | 类型                 | 说明                              |
| ------ | ---- | -------------------- | --------------------------------- |
| fields | 否   | string&#124;string[] | rule中的filed，默认清理整表单验证 |

## addOn
添加事件

| 参数     | 必填 | 类型     | 说明          |
| -------- | ---- | -------- | ------------- |
| field    | 是   | string   | rule中的filed |
| event    | 是   | string   | 事件名称      |
| callback | 否   | function | 事件回调      |

## delOn
删除事件或监听

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 是   | string | rule中的filed |
| event | 是   | string | 事件名称      |

## getComponent
获取type对应组件vue对象，非组件返回为null

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 是   | string | rule中的filed |

## getEl
获取组件对应el或html dom数据

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 是   | string | rule中的filed |

## $t
多语言转换

| 参数 | 必填 | 类型   | 说明           |
| ---- | ---- | ------ | -------------- |
| str  | 是   | string | 需转换的字符串 |

**返回值：string**



#### demo

:::demo 
ant/ruleApis
:::


## getApi

不同xxx.vue文件渲染在同一个页面且需要相互交互的时候使用

| 参数 | 必填 | 类型   | 说明                                                    |
| ---- | ---- | ------ | ------------------------------------------------------- |
| name | 是   | string | 获取有配置name值的&lt;beast-form name="xxx" /&gt; 的api |

#### demo

:::demo 
getApi
:::