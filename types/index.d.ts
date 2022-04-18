import { VNodeProps } from 'vue'

export declare type Rule = {
    // 必须
    type: string;
    // 与当前组件相关
    props?: object,
    // form-item相关
    field?: string;   //这个比较特殊,用来做规则对象查找的字段
    value?: any,
    modelValueKey?: string,
    validate?: Array<any>,
    title?: string | Rule,
    showFormItem?: Boolean,
    // 布局相关
    children?: Array<Rule>,
    slot?: string,
};

