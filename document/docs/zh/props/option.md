# option

## ts中使用
```ts
import type { PropsOptionType } from "vue-beast-form";

const option = ref<PropsOptionType>()
```


## 参数

| 名称   | 类型        | 说明                                |
| ------ | ----------- | ----------------------------------- |
| form   | {key:value} | form层的props设置                   |
| isForm | boolean     | 是否顶层渲染为form否则div，默认true |
| isI18n | boolean     | 是否使用国际化多语言                |