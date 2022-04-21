export type RuleType = {
    // 必须
    type: string;
    // 与当前组件相关
    props?: any;
    // form-item相关
    //这个比较特殊,用来做规则对象查找的字段
    field?: string;
    title?: string | RuleType;
    value?: any;
    vModelKey?: string;
    validate?: Array<RuleValidateType>;
    showFormItem?: Boolean;
    // 布局相关
    children?: Array<RuleType | string>;
    slot?: string;
}

export interface RuleValidateType {
    type?: string;
    required?: boolean;
    message?: string;
    trigger?: string;
}

export type PropsOptionType = {
    form: any
}

export type ApiFnType = {
    getRule(field: string, rules?: RuleType[] | RuleType): RuleType | null;
    updateRule(field: string, rule: RuleType): void;
    setFieldChange(field: string, value: any): void;
}