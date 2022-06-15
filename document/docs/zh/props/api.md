# api

提供获取、设置、验证的一些相关方法

下方api方法的参数field支持"field.subfield"形式检索，但上级field必须是唯一的

## field示例

:::demo 
subField
:::


## 规则相关
### setValue

用于给表单组件设置值

| 参数  | 必填 | 类型   | 说明                                                 |
| ----- | ---- | ------ | ---------------------------------------------------- |
| field | 是   | string | rule中的filed                                        |
| value | 是   | any    | 值                                                   |
| key   | 否   | string | 当值是对象且只想修改对象中的某个值可传入这个值的name |


<CodeGroup>
  <CodeGroupItem title="正常赋值" active>

```js
api.setValue("name","Tony")
```

  </CodeGroupItem>
  <CodeGroupItem title="key参数的使用" >

```js
const obj = {
  name: "Tony",
  age: 12
}

api.setValue("name",obj,"name")

```
  </CodeGroupItem>
</CodeGroup>

### setTitle

给rule中title的设置值

| 参数  | 必填 | 类型                                       | 说明          |
| ----- | ---- | ------------------------------------------ | ------------- |
| field | 是   | string                                     | rule中的filed |
| value | 是   | string,objcet<RuleType[](./rule.md)>,false | 值            |


<CodeGroup>
  <CodeGroupItem title="value:string" active>

```js
api.setTitle("name","Tony")
```

  </CodeGroupItem>
  <CodeGroupItem title="value:object" >

```js
api.setTitle("name",{
    type:"span",
    children:["Tony teacher"]
})
```

  </CodeGroupItem>
  <CodeGroupItem title="value:false" >

```js
api.setTitle("name",false)
```

  </CodeGroupItem>
</CodeGroup>

### setDisplay
设置隐藏显示  false为隐藏

| 参数    | 必填 | 类型    | 说明          |
| ------- | ---- | ------- | ------------- |
| field   | 是   | string  | rule中的filed |
| display | 是   | boolean | 值            |

```js
api.setDisplay("name",false)
```

### setDisabled
设置禁用 true为禁用

| 参数     | 必填 | 类型    | 说明          |
| -------- | ---- | ------- | ------------- |
| field    | 是   | string  | rule中的filed |
| disabled | 是   | boolean | 值            |

```js
api.setDisabled("name",false)
```

### setChildren
设置children

| 参数     | 必填 | 类型                                     | 说明          |
| -------- | ---- | ---------------------------------------- | ------------- |
| field    | 是   | string                                   | rule中的filed |
| children | 是   | []string,[]objcet<RuleType[](./rule.md)> | 值            |

<CodeGroup>
  <CodeGroupItem title="children:string" active>

```js
api.setChildren("name",["Tony"])
```

  </CodeGroupItem>
  <CodeGroupItem title="children:object" >

```js   
api.setChildren("name",[{
    type:"span",
    children:["Tony teacher"]
}])
```

  </CodeGroupItem>
</CodeGroup>

### getProps
获取某个字段的props

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 是   | string | rule中的filed |
    
```js
// 假设规则是 {
//   field:"name",
//   type:"a-input",
//   props:{
//     placeholder:"请输入姓名"
//   }
// }
const props = api.getProps("name")
console.log("props:",props);
//   props: {placeholder:"请输入姓名"}
```

## Form相关
### getFormData
获取表单数据

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 否   | string | rule中的filed |

<CodeGroup>
  <CodeGroupItem title="获取表单数据" active>

```js
// 假设表单数据 {name:"Tony",age:12}
const data = api.getFormData()
console.log("data:",data);
// data: {name:"Tony",age:12}
```

  </CodeGroupItem>
  <CodeGroupItem title="获取某个字段的数据" >

```js
// 假设表单数据 {name:"Tony",age:12}
const data = api.getFormData("name")
console.log("data:",data);
// data: "Tony"
```

  </CodeGroupItem>
</CodeGroup>

### resetFormData
重置表单数据，重置回表单初始化时候的数据

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 否   | string | rule中的filed |

<CodeGroup>
  <CodeGroupItem title="重置表单数据" active>

```js
// 假设表单数据 {name:"Tony",age:12}
api.resetFormData()
// {}
```

  </CodeGroupItem>
  <CodeGroupItem title="重置某个字段的数据" >

```js
// 假设表单数据 {name:"Tony",age:12}
api.resetFormData("name")
// {age:12}
```

  </CodeGroupItem>
</CodeGroup>

### clearValue
清空表单值

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 否   | string | rule中的filed |

<CodeGroup>
  <CodeGroupItem title="清空表单值" active>

```js
// 假设表单数据 {name:"Tony",age:12}
api.clearValue()
// {}
```

  </CodeGroupItem>
  <CodeGroupItem title="清空某个字段的值" >

```js
// 假设表单数据 {name:"Tony",age:12}
api.clearValue("name")
// {age:12}
```

  </CodeGroupItem>
</CodeGroup>

### validate
验证表单

| 参数     | 必填 | 类型     | 说明          |
| -------- | ---- | -------- | ------------- |
| callback | 否   | function | 验证结果      |
| field    | 否   | string   | rule中的filed |

<CodeGroup>
  <CodeGroupItem title="验证表单" active>

```js
api.validate((valid:boolean)=> {
    console.log("valid:",valid?"验证通过":"验证失败");
})
```

  </CodeGroupItem>
  <CodeGroupItem title="验证某个字段" >

```js
api.validate((valid:boolean)=>{
    console.log("valid:",valid?"验证通过":"验证失败");
},"name")
```

  </CodeGroupItem>
</CodeGroup>

### clearValidate
清空验证结果

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 否   | string | rule中的filed |

<CodeGroup>
  <CodeGroupItem title="清空验证结果" active>

```js
api.clearValidate()
```

  </CodeGroupItem>
  <CodeGroupItem title="清空某个字段的验证结果" >

```js
api.clearValidate("name")
```

  </CodeGroupItem>
</CodeGroup>


## 其他


### isModelKey
是否是表单组件记录值的key

| 参数  | 必填 | 类型   | 说明          |
| ----- | ---- | ------ | ------------- |
| field | 是   | string | rule中的filed |

```js
// 假设表单数据 {name:"Tony",age:12}
api.isModelKey("name")  // true
api.isModelKey("tex")  // false
```