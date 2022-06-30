import type { RuleType } from "./rule"

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
    setTitle(field: string, value: string | RuleType | false): void
    /**
     * 设置class
     * @param field 
     * @param value 
     */
    setClass(field: string, value: any): void
    /**
     * 设置attrs
     * @param field 
     * @param value 
     */
    setAttrs(field: string, value: any): void
    /**
     * 设置style
     * @param field 
     * @param value 
     */
    setStyle(field: string, value: any): void
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
     * 插入children 不指定index就在最后
     * @param field 
     * @param children 
     * @param index 
     */
    pushChildren(field: string, children: RuleType | string, index?: number): void
    /**
     * 清理children 不指定index就清理所有
     * @param field 
     * @param index 
     */
    clearChildren(field: string, index?: number): void
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
     * 清除值
     * @param field 
     */
    clearValue(field?: string): void
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
    clearValidate(fields?: string[] | string): void
    /**
   * 当前字段是否是model的key
   * @param field 
   */
    isModelKey(field: string): boolean
    /**
     * 获取输入组件的props
     * @param field 
     */
    getProps(field: string): any
    /**
     * 添加事件
     * @param field 
     * @param eventName 
     * @param callback 
     */
    addOn(field: string, eventName: string, callback: Function): void
}