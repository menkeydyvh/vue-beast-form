import { globalCache } from "./loader"
import type { ComponentInternalInstance } from 'vue'
import type { ApiType } from '../types'


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

    vm: ComponentInternalInstance

    fieldVms: Record<string, ComponentInternalInstance> = {}

    constructor(vm: ComponentInternalInstance) {
        this.vm = vm
    }


    /**
   * 记录数据
   * @param ruleFs 
   */
    addfieldVms(field: string, vm: ComponentInternalInstance) {
        this.fieldVms[field] = vm
    }


    /**
       * 通过field检索规则  支持xxx.xxx层级方式
       * @param field 
       * @returns 
       */
    getRule = (field: string) => {
        return this.fieldVms[field]
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
                    return rf
                }
            },
            getEl(field) {
                const rf = self.getRule(field)
                if (rf) {
                    return rf.proxy.$el as HTMLElement
                }
            },
            setValue(field, value, key) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.exposed.setValue(value, key)
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
                        rf.exposed.setAttrs(key, attrs[key])
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
                    rf.exposed.setProps(key, value)
                }
            },
            setFormItemClass(field, value) {
                const rf = self.getRule(`formItem-${field}`)
                if (rf) {
                    rf.exposed.setProps('class', value)
                }
            },
            setFormItemStyle(field, value) {
                const rf = self.getRule(`formItem-${field}`)
                if (rf) {
                    rf.exposed.setProps('style', value)
                }
            },
            setDisplay(field, display) {
                const rf = self.getRule(`formItem-${field}`)
                if (rf) {
                    rf.exposed.setDisplay(display === true)
                }
            },
            setDisabled(field, disabled) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.exposed.setDisabled(disabled)
                }
            },
            pushChildren(field, rule, index, slot) {
                const rf = self.getRule(field)
                if (rf) {
                    // 统一插入处理
                    // rf.addChildren(rule, index, slot)
                }
            },
            delChildren(field, index, slot) {
                const rf = self.getRule(field)
                if (rf) {
                    // rf.delChildren(index, slot)
                }
            },
            isModelKey(field) {
                return Object.keys(self.vm.proxy?.['modelValue'] ?? {}).includes(field)
            },
            getFormData(field) {
                if (field) {
                    const rf = self.getRule(field)
                    if (rf) {
                        return rf.exposed.getValue()
                    }
                } else {
                    return self.vm.proxy?.['modelValue'];
                }
            },
            resetFormData(field) {
                if (field) {
                    const rf = self.getRule(field)
                    if (rf) {
                        rf.exposed.setValue(null)
                    }
                } else {
                    for (let key in self.vm.proxy?.['modelValue']) {
                        this.resetFormData(key);
                    }
                }
            },
            async validate(callback, fields, formVm) {
                // let valid = true, data = null
                // if (formVm) {
                //     if (!await formValidate(formVm.refs[beastName.FORMREF], fields)) {
                //         valid = false
                //     }
                // } else {
                //     if (self.allVms) {
                //         let i = 0, len = self.allVms.length;
                //         for (i; i < len; i++) {
                //             if (!await formValidate(self.allVms[i].refs[beastName.FORMREF], fields)) {
                //                 valid = false
                //             }
                //         }
                //     }
                // }
                // if (valid) {
                //     if (fields) {
                //         if (Array.isArray(fields)) {
                //             data = {};
                //             fields.forEach(field => {
                //                 data[field] = this.getFormData(field);
                //             })
                //         } else {
                //             data = this.getFormData(fields);
                //         }
                //     } else {
                //         data = this.getFormData();
                //     }
                // }
                // callback(valid, data)
            },
            clearValidate(fields, formVm) {
                if (formVm) {
                    // clearFormValidate(formVm.refs[beastName.FORMREF], fields);
                } else {
                    // if (self.allVms) {
                    //     self.allVms.forEach(item => {
                    //         clearFormValidate(item.refs[beastName.FORMREF], fields);
                    //     })
                    // }
                }
            },
            addOn(field, event, callback) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.exposed.addOn(event, callback)
                }
            },
            addEmit(field, emit) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.exposed.addEmit(emit)
                }
            },
            delOnOrEmit(field, event) {
                const rf = self.getRule(field)
                if (rf) {
                    rf.exposed.delOnOrEmit(event)
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