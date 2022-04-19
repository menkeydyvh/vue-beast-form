export interface RuleType {
    // 必须
    type: string;
    // 与当前组件相关
    props: any;
    // form-item相关
    //这个比较特殊,用来做规则对象查找的字段
    field: string;
    title: string | RuleType;
    value: any;
    modelValueKey: string;
    validate: Array<RuleValidateType>;
    showFormItem?: Boolean;
    // 布局相关
    children: RuleType[];
    slot: string;
}


export interface RuleValidateType {
    type?: string;
    required?: boolean;
    message?: string;
}

export type ApiFnType = {
    getRule(field: string, rules?: Array<RuleType> | RuleType): RuleType | null;
    updateRule(field: string, rule: RuleType): void;
    setFieldChange(field: string, value: any): void;
}