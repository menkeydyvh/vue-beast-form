# 全局api

## 明细

| 名称               | 参数            | 说明                  | 例子                            |
| ------------------ | --------------- | --------------------- | ------------------------------- |
| components         | (data)          | 加载组件              | [查看](../guide/demandLoad.md)  |
| directive          | (key,directive) | 加载指令              | [查看](../guide/demandLoad.md)  |
| ruleParse          | (str)           | 规则字符串转换成对象  | [查看](#规则的对象与字符串转换) |
| ruleStringify      | (rules,space)   | 对象规则转化成字符串  | [查看](#规则的对象与字符串转换) |
| setBasePropsOption | (po)            | 设置基础的PropsOption | [查看](#setbasepropsoption)     |


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

const ruleStr = vbf.ruleStringify(ruleTemp)

const ruleObj = vbf.ruleParse(ruleStr)

...