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
    props?: any;
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
     * 一个 v-model:key  值为key 
     * 
     * 多个 v-model:key时可用 [key,key1,key2]
     * 
     * 多个v-model时 也可只设置其一个来针对这个key获取
     */
    vModelKey?: string | string[];
    /**
     * 默认值 null  主要为了处理默认值不为null的时候处理
     * 
     * 当vModelKey设置为数组时需要与其保持一致长度
     */
    vModelKeyDefaultValue?: any;
    /**
     * 对应vModelKey的值
     * 
     * 当vModelKey为数组时候这个值会变为对象形式
     * 
     * 例: vModelKey = [key,key1,key2]
     * 
     * value = {
     *    key:xxx,
     *    key1:xxx,
     *    key2:xxx,
     * }
     */
    value?: any;
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
    class?: any;
    /**
     * 设置在type对应的style上
     * 
     * 诺为表单输入组件会设置在form-item的style上
     */
    style?: any;
    /**
     * 设置在type对应的attrs上
     * 
     * 诺为表单输入组件会设置在form-item的attrs上
     */
    attrs?: any;
    /**
     * 子规则或子文本内容
     */
    children?: Array<RuleType | string>;
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
    on?: any
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
}
export interface EmitType {
    event: string;
    alias: string;
}