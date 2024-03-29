import { globalCache } from "./loader.js"
import FormFactory from "./form.js"
import type { ComponentInternalInstance } from 'vue'
import type { RuleFactory } from './rule'
import type { ApiType } from '../types'

/**
 * 
 * @param ary 
 * @param value 
 * @param callback 
 */
const searchLoop = (
    ary: Array<RuleFactory | string>,
    value: any,
    callback: (data: {
        item: RuleFactory,
        index: number,
        ary: Array<RuleFactory | string>
    }
    ) => void) => {
    ary.forEach((item, index) => {
        if (typeof item != 'string') {
            if (item.rule.field === value) {
                return callback({ item, index, ary })
            }
            for (const slot in item.childrenSlot) {
                const childSlot = item.childrenSlot[slot]
                if (Array.isArray(childSlot) && childSlot.length) {
                    return searchLoop(childSlot, value, callback)
                }
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
            await formEvent[globalCache.config.baseConfig.formEventValidate](fields)
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
        formEvent[globalCache.config.baseConfig.formEventClearValidate](fields)
    }
}



export default class apiFactory {

    public vm: ComponentInternalInstance

    private modelValue: Record<string, any>

    private rfs: RuleFactory[]

    private allVms: ComponentInternalInstance[]

    constructor(vm: ComponentInternalInstance) {
        this.vm = vm
    }

    /**
   * 记录数据
   * @param modelValue 
   */
    setModelValue(modelValue: Record<string, any>) {
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
                    for (const slot in result.childrenSlot) {
                        const childSlot = result.childrenSlot[slot]
                        if (Array.isArray(childSlot) && childSlot.length) {
                            searchLoop(childSlot, fields[idx], ({ item }) => {
                                if (item) {
                                    result = item;
                                } else {
                                    result = null;
                                }
                            })
                        }
                    }
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
     * 对外发布api
     * @returns 
     */
    publishApi(): ApiType {
        let self = this;
        return {
            getApi(name) {
                return globalCache.cacheApi[name]
            },
            getComponent(field) {
                const rf = self.getRule(field)
                if (rf) {
                    return rf.component.component
                }
            },
            getEl(field) {
                const rf = self.getRule(field)
                if (rf) {
                    return rf.component.el as HTMLElement
                }
            },
            setValue(field, value, key) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.setValue(value, key)
                }
            },
            setClass(field, value) {
                this.setProps(field, "class", value)
            },
            setStyle(field, value) {
                this.setProps(field, "style", value)
            },
            setAttrs(field, attrs) {
                const rf = self.getRule(field)
                if (rf) {
                    for (let key in attrs) {
                        rf.setAttrs(key, attrs[key])
                    }
                }
            },
            getProps(field, key) {
                const rf = self.getRule(field)
                if (rf) {
                    return rf.props[key]
                }
            },
            setProps(field, key, value) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.setProps(key, value)
                }
            },
            setFormItemClass(field, value) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.setFormItemProps('class', value)
                }
            },
            setFormItemStyle(field, value) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.setFormItemProps('style', value)
                }
            },
            setDisplay(field, display) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.display.value = display === true
                }
            },
            setDisabled(field, disabled) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.setDisabled(disabled)
                }
            },
            pushChildren(field, rule, index, slot) {
                const rf = self.getRule(field)
                if (rf) {
                    // 统一插入处理
                    rf.addChildren(rule, index, slot)
                }
            },
            delChildren(field, index, slot) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.delChildren(index, slot)
                }
            },
            isModelKey(field) {
                return Object.keys(self.modelValue).includes(field)
            },
            getFormData(field) {
                if (field) {
                    if (this.isModelKey(field)) {
                        const rf = self.getRule(field)
                        if (rf) {
                            return rf.getValue()
                        }
                    }
                } else {
                    const data = {};
                    for (let key in self.modelValue) {
                        data[key] = this.getFormData(key)
                    }
                    return data;
                }
            },
            resetFormData(field) {
                if (field) {
                    if (this.isModelKey(field)) {
                        const rf = self.getRule(field)
                        if (rf) {
                            rf.setValue(undefined)
                        }
                    }
                } else {
                    for (let key in self.modelValue) {
                        this.resetFormData(key);
                    }
                }
            },
            async validate(callback, fields, formVm) {
                let valid = true, data = null
                if (formVm) {
                    if (!await formValidate(formVm.refs[FormFactory.formRefsName], fields)) {
                        valid = false
                    }
                } else {
                    if (self.allVms) {
                        let i = 0, len = self.allVms.length;
                        for (i; i < len; i++) {
                            if (!await formValidate(self.allVms[i].refs[FormFactory.formRefsName], fields)) {
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
            },
            clearValidate(fields, formVm) {
                if (formVm) {
                    clearFormValidate(formVm.refs[FormFactory.formRefsName], fields);
                } else {
                    if (self.allVms) {
                        self.allVms.forEach(item => {
                            clearFormValidate(item.refs[FormFactory.formRefsName], fields);
                        })
                    }
                }
            },
            addOn(field, event, callback) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.addOn(event, callback)
                }
            },
            addEmit(field, emit) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.addEmit(emit)
                }
            },
            delOn(field, event) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.delOnOrEmit(event)
                }
            },
            $t(str) {
                if (globalCache.t) {
                    return globalCache.t(str)
                } else {
                    return str
                }
            },
        }
    }
}