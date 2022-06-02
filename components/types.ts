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
     * v-if和v-show的作用
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
}
export interface RuleValidateType {
    type?: string;
    required?: boolean;
    message?: string;
    trigger?: string;
}

export type PropsOptionType = {
    form: any
    isForm: boolean
}


export type ApiFnType = {
    /**
     * 设置数据
     * @param field 
     * @param value 
     * @param key 
     */
    setValue(field: string, value: any, key?: string): void
    /**
     *  设置titiel
     * @param field 
     * @param value 
     */
    setTitle(field: string, value: string | RuleType): void
    /**
     * 设置display
     * @param field 
     * @param display 
     */
    setDisplay(field: string, display?: boolean): void
    /**
     * 设置disabled
     * @param field 
     * @param isBool 
     */
    setDisabled(field: string, isBool?: boolean): void
    /**
     * 设置children
     * @param field 
     * @param children 
     */
    setChildren(field: string, children?: Array<RuleType | string>): void
    /**
     * 获取输入组件的值
     * @param field 
     */
    getFormData(field?: string): any
    /**
     * 重置FormData
     * @param field 
     */
    resetFormData(field?: string): void
    /**
     * 获取输入组件的props
     * @param field 
     */
    getProps(field: string): any
    /**
     * 清除值
     * @param field 
     */
    clearValue(field?: string): void
    /**
     * 当前字段是否是model的key
     * @param field 
     */
    isModelKey(field: string): boolean
    /**
     * 表单验证，目前表单验证只负责主表单
     * @param callback 
     * @param fields 
     */
    validate(callback: Function, fields?: string | string[]): void
    /**
     * 清除验证
     * @param fields 
     */
    clearValidate(fields?: [string] | string): void
}


export interface DefaultName {
    /**
     * 框架form组件的名称：例如'a-form'
     */
    form?: string;
    /**
    * 框架form组件的formItem名称：例如'a-form-item'
    */
    formItem?: string;
    /**
     * formItem对应model上的key：例如'name'
     */
    formItemPropName?: string;
    /**
     * formItem对应标题label的key：例如'label'
     */
    formItemPropLabel?: string;
    /**
     * formItem对应标题label的插槽key：例如'label'
     */
    formItemSlotTitle?: string;
    /**
     * form表单验证事件名称
     */
    formEventValidate?: string;
    /**
     * form表单清除验证事件名称
     */
    formEventClearValidate?: string;
}

export interface ConfigOptionsType {
    /**
     * 框架会内置一些ui库的配置 可以直接使用 或自定义一套新ui库进来
     */
    base: string
    /**
     * 配置多个框架名称方便导入默认配置
     */
    frameworks: string[],
    /**
     * 表单form相关核心配置项
     */
    defaultName?: DefaultName;
    /**
     * 表单组件v-model:key配置key
     */
    formDataComponentKey?: {
        [componentName: string]: string | string[]
    }
    /**
     * 表单组件v-model:key配置key的默认空值
     */
    formDataComponentDefaultValue?: {
        [key: string]: any;
    }
    /**
     * 表单组件v-model:key配置key修改的监听名称
     */
    formDataComponentChangeKeyEvent?: {
        [key: string]: string | string[];
    }
}