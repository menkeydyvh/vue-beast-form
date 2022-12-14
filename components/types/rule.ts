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
    props?: {
        [key: string]: any
    };
    /**
     * 可用于api使用时候的检索功能
     * 
     * 诺为表单输入组件时为赋值的字段名称
     */
    field?: string;
    /**
     * form-item对应的标题
     */
    title?: string | RuleType | false;
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
    value?: any | {
        [field: string]: any
    };
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
    style?: string | {
        [key: string]: string
    };
    /**
     * 设置在type对应的attrs上
     * 
     * 诺为表单输入组件会设置在form-item的attrs上
     */
    attrs?: {
        [key: string]: any
    };
    /**
     * 子规则或子文本内容
     */
    children?: Array<RuleType | string> | { [slot: string]: Function };
    /**
     * 插槽名称
     */
    slot?: string;
    /**
     * 显示组件
     */
    display?: boolean;
    /**
     * 指令
     */
    directives?: Array<[Directive | string] | [Directive | string, any] | [Directive | string, any, string] | [Directive | string, any, string, Record<string, boolean>]>
    /**
     * 事件会覆盖props内同名事件处理
     */
    on?: {
        [onName: string]: Function
    }
    /**
     * 会抛出事件
     */
    emits?: Array<EmitType>
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