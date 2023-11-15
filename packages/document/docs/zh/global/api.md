# 全局api

## 明细

| 名称                                      | 参数                     | 说明                                                    |
| ----------------------------------------- | ------------------------ | ------------------------------------------------------- |
| [BeastForm](#beastform)                   | -                        | 本组件                                                  |
| [components](../guide/demandLoad.md)      | {}                       | 加载组件                                                |
| [ruleParse](#规则的对象与字符串转换)      | string                   | 规则字符串转换成对象                                    |
| [ruleStringify](#规则的对象与字符串转换)  | RuleType&#124;RuleType[] | 对象规则转化成字符串                                    |
| [setBasePropsOption](#setbasepropsoption) | PropsOptionType          | 设置基础的PropsOption                                   |
| [getApi](../props/api.md#getapi)          | string                   | 获取有配置name值的&lt;beast-form name="xxx" /&gt; 的api |


## BeastForm
本框架组件在.vue文件中加载使用

xxx.vue
```js
import { BeastForm } from 'vue-beast-form'

export default {
  components: { BeastForm }
}
```

## setBasePropsOption

给所有的props.option设置一个默认值

main.js
```js
import {setBasePropsOption} from 'vue-beast-form'

setBasePropsOption({
    // 设置默认form的展示
    form: {
        layout: "vertical",
    },
    // 设置默认全局启用 多语言
    isI18n: true
})
```

## 规则的对象与字符串转换

提供方便json中的函数在转换字符串和对象时候的处理

```js
import { ruleStringify, ruleParse } from 'vue-beast-form'

const ruleTemp = [
    {
        field:'test',
        on:{
            click:(e,api)=>{
                // ....
            }
        }
    }
]

// 转换成字符串
const ruleStr = ruleStringify(ruleTemp)

// 转换回对象
const ruleObj = ruleParse(ruleStr)

...