import type { Component, App } from 'vue'

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
    getRule(field: string, rules?: Array<RuleType> | RuleType): RuleType | null
    updateRule(field: string, rule: RuleType, isMerge?: boolean): void
    setFieldChange(field: string, value: any): void
    getFormData(field?: string): any
    isModelKey(field: string): boolean
    validate(callback: Function, fields: string | string[]): void
}

declare module 'json-layout' {
    export const name = 'JsonLayout';

    export const components: Record<string, Component>;
    export interface props {
        rule: RuleType;
        api: ApiFnType;
        option: PropsOptionType;
        modelValue: any
        isForm: boolean
        "update:api": Function
        "update:modelValue": Function
    }

    export function install(app: App): App

}