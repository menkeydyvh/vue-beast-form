import { getCurrentInstance } from "vue"
import FormFactory, { baseInject } from "./form"
import type { ModelValueType } from "./form"
import type { ComponentInternalInstance } from 'vue'
import type { RuleFactory } from './rule'
import type { RuleType, EmitType } from '../types'


/**
 * 
 * @param ary 
 * @param value 
 * @param callback 
 */
const searchLoop = (
    ary: RuleFactory[],
    value: any,
    callback: (data: {
        item: RuleFactory,
        index: number,
        ary: RuleFactory[]
    }
    ) => void) => {
    ary.forEach((item, index) => {
        if (typeof item != 'string') {
            if (item.rule.field === value) {
                return callback({ item, index, ary })
            }

            if (item.children) {
                return searchLoop(item.children as RuleFactory[], value, callback)
            }
        }
    })
}


/**
    * 表单验证表单字段验证
    * @param formEvent 
    * @param fields 
    * @returns 
    */
const formValidate = async (formEvent: any, fields?: string | string[]) => {
    if (formEvent) {
        try {
            await formEvent[baseInject.config.defaultName.formEventValidate](fields)
        } catch (error) {
            return false;
        }
    }
    return true;
}

/**
    * 清除表单验证
    * @param formEvent 
    * @param fields 
    */
const clearFormValidate = (formEvent: any, fields?: string | string[]) => {
    if (formEvent) {
        formEvent[baseInject.config.defaultName.formEventClearValidate](fields)
    }
}

export default class apiFactory {

    public vm: ComponentInternalInstance

    private modelValue: ModelValueType

    private rfs: RuleFactory[]

    private allVms: ComponentInternalInstance[]

    constructor() {
        this.vm = getCurrentInstance()
    }

    /**
   * 记录数据
   * @param modelValue 
   */
    setModelValue(modelValue: ModelValueType) {
        this.modelValue = modelValue
    }

    /**
   * 记录数据
   * @param ruleFs 
   */
    setRfs(ruleFs: RuleFactory[]) {
        this.rfs = ruleFs || []
    }

    /**
   * 记录数据
   * @param ruleFs 
   */
    setAllVms(allVms: ComponentInternalInstance[]) {
        this.allVms = allVms
    }


    /**
       * 通过field检索规则  支持xxx.xxx层级方式
       * @param field 
       * @returns 
       */
    private getRule = (field: string) => {
        let result: RuleFactory = null;
        if (field) {
            const fields = field.split('.'), len = fields.length;
            for (let idx = 0; idx < len; idx++) {
                if (idx === 0) {
                    searchLoop(this.rfs, fields[idx], ({ item }) => {
                        if (item) {
                            result = item;
                        }
                    })
                } else if (result) {
                    searchLoop(result.children as RuleFactory[], fields[idx], ({ item }) => {
                        if (item) {
                            result = item;
                        } else {
                            result = null;
                        }
                    })
                } else {
                    result = null;
                }
                if (!result) {
                    break;
                }
            }
        }
        if (!result) {
            console.error(`invalid "field=${field}"`)
        }
        return result
    }


    /**
     * 修改值
     * @param field 
     * @param value 
     * @param key 
     */
    setValue(field: string, value: any, key?: string) {
        const rf = this.getRule(field)
        if (rf) {
            rf.setValue(value, key)
        }
    }

    /**
     * 设置class
     * @param field 
     * @param value 
     */
    setClass(field: string, value: any) {
        this.setProps(field, "class", value)
    }

    /**
     * 设置style
     * @param field 
     * @param value 
     */
    setStyle(field: string, value: any) {
        this.setProps(field, "style", value)
    }

    /**
     * 设置attrs
     * @param field 
     * @param attrs
     */
    setAttrs(field: string, attrs: { [key: string]: any }) {
        const rf = this.getRule(field)
        if (rf) {
            for (let key in attrs) {
                rf.setAttrs(key, attrs[key])
            }
        }
    }

    /**
     * 设置props
     * @param field 
     * @param value 
     */
    setProps(field: string, key: string, value: any) {
        const rf = this.getRule(field)
        if (rf) {
            rf.setProps(key, value)
        }
    }

    getProps(field: string) {
        const rf = this.getRule(field)
        if (rf) {
            return rf.props
        }
    }

    /**
     * 设置是否显示
     * @param field 
     * @param display 
     */
    setDisplay(field: string, display: boolean) {
        const rf = this.getRule(field)
        if (rf) {
            rf.display.value = display === true
        }
    }

    /**
     * 设置禁用
     * @param field 
     * @param isBool 
     */
    setDisabled(field: string, isBool: boolean) {
        const rf = this.getRule(field)
        if (rf) {
            rf.setDisabled(isBool)
        }
    }

    /**
     * 插入子节点
     * @param field 
     * @param rule 
     * @param index 
     */
    pushChildren(field: string, rule: string | RuleType, index?: number) {
        const rf = this.getRule(field)
        if (rf) {
            // 统一插入处理
            rf.addChildren(rule, index)
        }
    }

    /**
     * 删除子节点
     * @param field 
     * @param index 
     */
    delChildren(field: string, index?: number) {
        const rf = this.getRule(field)
        if (rf) {
            rf.delChildren(index)
        }
    }

    /**
     * 检测是不是model的key
     * @param field 
     * @returns 
     */
    isModelKey(field: string) {
        return Object.keys(this.modelValue).includes(field)
    }

    /**
     * 获取表单数据集
     * @param field 
     * @returns 
     */
    getFormData(field?: string) {
        if (field) {
            if (this.isModelKey(field)) {
                const rf = this.getRule(field)
                if (rf) {
                    return rf.getValue()
                }
            }
        } else {
            const data = {};
            for (let key in this.modelValue) {
                data[key] = this.getFormData(key)
            }
            return data;
        }
    }

    /**
     * 重置为组件空值
     * @param field 
     */
    resetFormData(field?: string) {
        if (field) {
            if (this.isModelKey(field)) {
                const rf = this.getRule(field)
                if (rf) {
                    return rf.setValue(undefined)
                }
            }
        } else {
            for (let key in this.modelValue) {
                this.resetFormData(key);
            }
        }
    }

    /**
     * 验证字段规则
     * @param callback 
     * @param fields 
     */
    async validate(callback: (valid: boolean, data: any) => void, fields?: string | string[], formVm?: ComponentInternalInstance) {
        let valid = true, data = null
        if (formVm) {
            if (!await formValidate(formVm.refs[FormFactory.formRefsName], fields)) {
                valid = false
            }
        } else {
            if (this.allVms) {
                let i = 0, len = this.allVms.length;
                for (i; i < len; i++) {
                    if (!await formValidate(this.allVms[i].refs[FormFactory.formRefsName], fields)) {
                        valid = false
                    }
                }
            }
        }
        if (valid) {
            if (fields) {
                if (Array.isArray(fields)) {
                    data = {};
                    fields.forEach(field => {
                        data[field] = this.getFormData(field);
                    })
                } else {
                    data = this.getFormData(fields);
                }
            } else {
                data = this.getFormData();
            }
        }
        callback(valid, data)
    }

    /**
     * 清理字段验证
     * @param fields 
     */
    clearValidate(fields?: string | string[], formVm?: ComponentInternalInstance) {
        if (formVm) {
            clearFormValidate(formVm.refs[FormFactory.formRefsName], fields);
        } else {
            if (this.allVms) {
                this.allVms.forEach(item => {
                    clearFormValidate(item.refs[FormFactory.formRefsName], fields);
                })
            }
        }
    }

    /**
     * 添加事件
     * @param field 
     * @param event 
     * @param callback 
     * @returns 
     */
    addOn(field: string, event: string, callback?: Function) {
        const rf = this.getRule(field)
        if (rf) {
            return rf.addOn(event, callback)
        }
    }

    /**
     * 添加事件监听
     * @param field 
     * @param emit 
     * @returns 
     */
    addEmit(field: string, emit: EmitType) {
        const rf = this.getRule(field)
        if (rf) {
            return rf.addEmit(emit)
        }
    }

    /**
     * 删除事件或监听
     * @param field 
     * @param event 
     * @returns 
     */
    delOnOrEmit(field: string, event: string) {
        const rf = this.getRule(field)
        if (rf) {
            return rf.delOnOrEmit(event)
        }
    }
}