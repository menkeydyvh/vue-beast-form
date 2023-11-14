import type { Directive } from 'vue'

export type RuleType = {
    /**
     * 对应组件名称，div、a-input ......
     * 
     * 【必填】
     */
    type: string;
    /**
     * 对应type的组件 props设置
     */
    props?: Record<string, any>;
    /**
     * 可用于api使用时候的检索功能
     * 
     * 诺为表单输入组件时为赋值的字段名称
     */
    field?: string;
    /**
     * form-item对应的标题
     */
    title?: RuleChlidren | false;
    /**
     *  v-model:key值为key [key]
     * 默认值 [modelValue]
     */
    model?: string[];
    /**     
     * 与model长度保持一致
     * 默认值 [null]  
     * 主要为了处理默认值不能设置为null的处理 例如有些model的默认值是[]或{}时候处理
     */
    defaultValue?: any[];
    /**
     * 当model为数组时候这个值会变为对象形式
     * value = {
     *    key:xxx,
     *    key1:xxx,
     *    key2:xxx,
     * }
     */
    value?: any | Record<string, any>;
    /**
     * 验证规则
     * 
     * 只在form-item存在时有效
     */
    validate?: Array<RuleValidateType>;
    /**
     * 设置在type对应的class上
     * 
     * 诺为表单输入组件会设置在form-item的class上
     */
    class?: string | string[];
    /**
     * 设置在type对应的style上
     * 
     * 诺为表单输入组件会设置在form-item的style上
     */
    style?: string | Record<string, any>;
    /**
     * 设置在type对应的attrs上
     * 
     * 诺为表单输入组件会设置在form-item的attrs上
     */
    attrs?: Record<string, any>;
    /**
     * 子规则或子文本内容
     */
    children?: RuleChlidren[] | Record<string, RuleChlidren | ChildrenFn>;
    /**
     * 插槽名称
     */
    slot?: string;
    /**
     * 显示组件
     */
    display?: boolean;
    /**
     * 不在支持
     * 指令
     * @deprecated('废弃')
     */
    directives?: Array<[Directive | string] | [Directive | string, any] | [Directive | string, any, string] | [Directive | string, any, string, Record<string, boolean>]>;
    /**
     * 事件会覆盖props内同名事件处理
     */
    on?: Record<string, Function>;
    /**
     * 不在支持
     * 会抛出事件 
     * @deprecated('废弃')
     */
    emits?: Array<EmitType>;
}


export interface RuleValidateType {
    type?: string;
    required?: boolean;
    message?: string;
    trigger?: string;
    validator?: Function;
}
export interface EmitType {
    event: string;
    alias: string;
}


export type RuleChlidren = RuleType | string;

export type ChildrenFn = (...any: any) => RuleChlidren | RuleChlidren[];