import { baseInject, modelValue, formRefsName } from "./form"
import type { RuleFactory } from './rule'
import type { RuleType } from '../types'

var rfs: RuleFactory[]

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
   * 通过field检索规则  支持xxx.xxx层级方式
   * @param field 
   * @returns 
   */
const getRule = (field: string) => {
    let result: RuleFactory = null;
    if (field) {
        const fields = field.split('.'), len = fields.length;
        for (let idx = 0; idx < len; idx++) {
            if (idx === 0) {
                searchLoop(rfs, fields[idx], ({ item }) => {
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

    constructor(renderFactorys?: RuleFactory[]) {
        this._updateRfs(renderFactorys)
    }

    /**
     * 更新记录数组
     * @param renderFactorys 
     */
    _updateRfs(renderFactorys: RuleFactory[]) {
        rfs = renderFactorys || []
    }

    /**
     * 修改值
     * @param field 
     * @param value 
     * @param key 
     */
    setValue(field: string, value: any, key?: string) {
        const rf = getRule(field)
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
        const rf = getRule(field)
        if (rf) {
            rf.props.class = value
        }
    }

    /**
     * 设置style
     * @param field 
     * @param value 
     */
    setStyle(field: string, value: any) {
        const rf = getRule(field)
        if (rf) {
            rf.props.style = value
        }
    }

    /**
     * 设置attrs
     * @param field 
     * @param value 
     */
    setAttrs(field: string, value: {
        [key: string]: any
    }) {
        const rf = getRule(field)
        if (rf) {
            for (let key in value) {
                rf.props[key] = value[key]
            }
        }
    }


    /**
     * 插入子节点
     * @param field 
     * @param rule 
     * @param index 
     */
    pushChildren(field: string, rule: string | RuleType, index?: number) {
        const rf = getRule(field)
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
        const rf = getRule(field)
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
        return Object.keys(modelValue).includes(field)
    }

    /**
     * 获取表单数据集
     * @param field 
     * @returns 
     */
    getFormData(field?: string) {
        if (field) {
            if (this.isModelKey(field)) {
                const rf = getRule(field)
                if (rf) {
                    return rf.getValue()
                }
            }
        } else {
            const data = {};
            for (let key in modelValue) {
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
                const rf = getRule(field)
                if (rf) {
                    return rf.setValue(undefined)
                }
            }
        } else {
            for (let key in modelValue) {
                this.resetFormData(key);
            }
        }
    }

    /**
     * 验证字段规则
     * @param callback 
     * @param fields 
     */
    async validate(callback: (valid: boolean) => void, fields?: string | string[]) {
        let valid = true
        if (baseInject.allVms) {
            let i = 0, len = baseInject.allVms.length;
            for (i; i < len; i++) {
                if (!await formValidate(baseInject.allVms[i].refs[formRefsName], fields)) {
                    valid = false
                }
            }
        }
        callback(valid)
    }

    /**
     * 清理字段验证
     * @param fields 
     */
    clearValidate(fields?: string | string[]) {
        if (baseInject.allVms) {
            baseInject.allVms.forEach(item => {
                clearFormValidate(item.refs[formRefsName], fields);
            })
        }
    }
}