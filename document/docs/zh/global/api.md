# 全局api

## 明细

| 名称                                      | 参数                                 | 说明                                           |
| ----------------------------------------- | ------------------------------------ | ---------------------------------------------- |
| [beastForm](#beastform)                   | -                                    | 本组件                                         |
| [components](../guide/demandLoad.md)      | data: {}                             | 加载组件                                       |
| [directive](../guide/demandLoad.md)       | key: string<br/>directive: Directive | 加载指令                                       |
| [emits](../guide/demandLoad.md)           | names: string&#124;string[]          | 提前设置好组件emits                            |
| [ruleParse](#规则的对象与字符串转换)      | str: string                          | 规则字符串转换成对象                           |
| [ruleStringify](#规则的对象与字符串转换)  | rules:RuleType&#124;RuleType[]       | 对象规则转化成字符串                           |
| [setBasePropsOption](#setbasepropsoption) | po: PropsOptionType                  | 设置基础的PropsOption                          |
| useFramework                              | frameworkName: string                | 多框架下切换框架使用，本文档多处使用注意看示例 |


## beastForm
本框架组件在.vue文件中加载使用

xxx.vue
```js
import vbf from 'vue-beast-form'

export default {
  components: { BeastForm: vbf.beastForm() }
}
```

## setBasePropsOption

给所有的props.option设置一个默认值

main.js
```js
import vbf from 'vue-beast-form'

vbf.setBasePropsOption({
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
import vbf from 'vue-beast-form'

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
const ruleStr = vbf.ruleStringify(ruleTemp)

// 转换回对象
const ruleObj = vbf.ruleParse(ruleStr)

...