import { globalCache } from "./loader"
import type { ComponentInternalInstance } from 'vue'
import type { ApiType } from '../types'
import { beastName } from "../tool";

export default class apiFactory {

    vm: ComponentInternalInstance;

    fieldVms: Record<string, ComponentInternalInstance> = {};

    constructor(vm: ComponentInternalInstance) {
        this.vm = vm;
    }

    /**
   * 记录数据
   * @param ruleFs 
   */
    addfieldVms(field: string, vm: ComponentInternalInstance) {
        this.fieldVms[field] = vm;
    }

    /**
       * 通过field检索规则  支持xxx.xxx层级方式
       * @param field 
       * @returns 
       */
    getRule = (field: string) => {
        return this.fieldVms[field];
    }
    $t = (str: string) => {
        if (globalCache.t) {
            return globalCache.t(str) as string;
        } else {
            return str;
        }
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
                const rf = self.getRule(`${beastName.BASEITEM}-${field}`)
                if (rf) {
                    rf.exposed.setProps('class', value)
                }
            },
            setFormItemStyle(field, value) {
                const rf = self.getRule(`${beastName.BASEITEM}-${field}`)
                if (rf) {
                    rf.exposed.setProps('style', value)
                }
            },
            setDisplay(field, display) {
                const rf = self.getRule(`${beastName.BASEITEM}-${field}`)
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
                return self.vm.exposed.getFormData(field);
            },
            resetFormData(field) {
                self.vm.exposed.resetFormData(field);
            },
            async validate(callback, fields, beastFormVm) {
                let valid = true, data = null;
                if (beastFormVm) {
                    if (!await beastFormVm.exposed.validate(fields)) {
                        valid = false
                    }
                } else {
                    if (!await self.vm.exposed.validate(fields)) {
                        valid = false
                    }
                }
                if (valid) {
                    if (beastFormVm) {
                        data = beastFormVm.exposed.getFormData()
                    } else {
                        data = this.getFormData()
                    }
                }
                callback(valid, data)
            },
            clearValidate(fields, beastFormVm) {
                if (beastFormVm) {
                    beastFormVm.exposed.clearFormValidate(fields);
                } else {
                    self.vm.exposed.clearFormValidate(fields);
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
                return self.$t(str);
            },
        }
    }
}