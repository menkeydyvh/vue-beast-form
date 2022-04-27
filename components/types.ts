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
    vModelKey?: string | string[];
    validate?: Array<RuleValidateType>;
    native?: Boolean;
    // 布局相关
    children?: Array<RuleType | string>;
    slot?: string;
    display?: 'show' | 'if';
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
    getRule(field: string): RuleType
    updateRule(field: string, rule: any, isMerge?: boolean): void
    setFieldValue(field: string, value: any, key?: string): void
    getFormData(field?: string): any
    isModelKey(field: string): boolean
    display(field: string, display?: 'show' | 'if'): void
    disabled(field: string, isBool?: boolean): void
    validate(callback: Function, fields?: string | string[]): void
}
