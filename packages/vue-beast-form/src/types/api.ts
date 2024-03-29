import type { ComponentInternalInstance } from 'vue'
import type { RuleType, EmitType, RuleChlidren } from './rule'

export interface ApiType {
  /**
   * 通过设置props.name获取对应api
   * @param name 
   */
  getApi(name: string): ApiType
  /**
   * 通过field获取组件
   * @param field 
   */
  getComponent(field: string): ComponentInternalInstance
  /**
   * 通过field获取dom元素
   * @param field 
   */
  getEl(field: string): HTMLElement
  /**
   * 修改值
   * @param field 
   * @param value 
   * @param key 
   */
  setValue(field: string, value: any, key?: string): void
  /**
   * 设置class
   * @param field 
   * @param value 
   */
  setClass(field: string, value: string | string[]): void
  /**
   * 设置style
   * @param field 
   * @param value 
   */
  setStyle(field: string, value: string | { [key: string]: string }): void
  /**
   * 设置attrs
   * @param field 
   * @param attrs
   */
  setAttrs(field: string, attrs: { [key: string]: any }): void
  /**
   * 获取props的值
   * @param field 
   * @param key 
   */
  getProps(field: string, key: string): any
  /**
   * 设置props
   * @param field 
   * @param value 
   */
  setProps(field: string, key: string, value: any): void
  /**
    * 设置formItem class
    * @param field 
    * @param value 
    */
  setFormItemClass(field: string, value: string | string[]): void
  /**
   * 设置formItem style
   * @param field 
   * @param value 
   */
  setFormItemStyle(field: string, value: string | { [key: string]: string }): void
  /**
   * 设置是否显示
   * @param field 
   * @param display 
   */
  setDisplay(field: string, display: boolean): void
  /**
  * 设置禁用
  * @param field 
  * @param disabled 
  */
  setDisabled(field: string, disabled: boolean): void
  /**
   * 添加子节点
   * @param field 
   * @param rule 
   * @param index 
   * @param slot 
   */
  pushChildren(field: string, rule: RuleChlidren, index?: number, slot?: string): void;
  /**
   * 删除子节点
   * @param field 
   * @param index 
   * @param slot 
   */
  delChildren(field: string, index?: number, slot?: string): void;
  /**
  * 检测是不是model的key
  * @param field 
  * @returns 
  */
  isModelKey(field: string): void
  /**
  * 获取表单数据集
  * @param field 
  * @returns 
  */
  getFormData(field?: string): { [key: string]: any }
  /**
   * 重置为组件空值
   * @param field 
   */
  resetFormData(field?: string): void
  /**
  * 验证字段规则
  * @param callback 
  * @param fields 
  */
  validate(callback: (valid: boolean, data: any) => void, fields?: string | string[], formVm?: ComponentInternalInstance): void
  /**
  * 清理字段验证
  * @param fields 
  */
  clearValidate(fields?: string | string[], formVm?: ComponentInternalInstance): void
  /**
  * 添加事件
  * @param field 
  * @param event 
  * @param callback 
  */
  addOn(field: string, event: string, callback?: Function): void
  /**
   * 删除事件或监听
   * @param field 
   * @param event 
   */
  delOn(field: string, event: string): void
  /**
   * 
   */
  addEmit(field: string, emit: EmitType): void
  /**
   * 提供多语言支持方法
   * @param str 
   */
  $t(str: string): string
}