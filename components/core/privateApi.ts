import type { ComponentInternalInstance } from "vue"
import type config from "../config"
import { provide, inject } from "vue"
import type { RuleType, DefaultName } from '../types'
import { loopRule } from '../tool'


export default class privateApi {
    /**
     * 默认配置
     */
    public defaultName: DefaultName;
    /**
     * 获取顶层表单vm
     */
    public baseFormVm: ComponentInternalInstance = null
    /**
     * 记录上层表单vm列表
     */
    public parentFormVms: ComponentInternalInstance[] = null
    /**
     * 记录子表单vm列表
     */
    public subFormVms: ComponentInternalInstance[] = []
    /**
     * 当前表单渲染的规则
     */
    public rules: RuleType

    constructor(vm: ComponentInternalInstance, config: config) {
        this.defaultName = config.defaultName;

        this.baseFormVm = inject<ComponentInternalInstance>('baseFormVm', null)
        this.parentFormVms = inject<ComponentInternalInstance[]>('subFormVms', null);

        if (this.baseFormVm === null) {
            provide('baseFormVm', vm)
            provide('subFormVms', this.subFormVms)
        }
    }

    /**
     * 表单验证表单字段验证
     * @param formEvent 
     * @param fields 
     * @returns 
     */
    async formValidate(formEvent: any, fields?: string | string[]) {
        if (formEvent) {
            try {
                await formEvent[this.defaultName.formEventValidate](fields)
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
    clearFormValidate(formEvent: any, fields?: string | string[]) {
        if (formEvent) {
            formEvent[this.defaultName.formEventClearValidate](fields)
        }
    }

    /**
     * 通过field检索规则  支持xxx.xxx层级方式
     * @param field 
     * @returns 
     */
    getRule(field: string): RuleType {
        let result = null, self = this;
        if (field) {
            let fields = field.split('.'), len = fields.length;
            for (let idx = 0; idx < len; idx++) {
                if (idx === 0) {
                    loopRule(self.rules.children as Array<RuleType>, fields[idx], ({ item }) => {
                        if (item) {
                            result = item;
                        }
                    })
                } else if (result) {
                    loopRule(result.children as Array<RuleType>, fields[idx], ({ item }) => {
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
        return result
    }

    /**
     * 设置整体规则
     * @param rules 
     */
    setRules(rules: RuleType) {
        this.rules = rules
    }

    /**
     * 给上层添加当前子表单
     * @param vm 
     */
    addParentFormVm(vm: ComponentInternalInstance) {
        if (this.parentFormVms) {
            this.parentFormVms.push(vm)
        }
    }

    /**
     * 给上层去除当前子表单
     * @param vm 
     */
    delParentFormVm(vm: ComponentInternalInstance) {
        if (this.parentFormVms) {
            let idx = this.parentFormVms.findIndex(item => item.uid === vm.uid)
            if (idx > -1) {
                this.parentFormVms.splice(idx, 1)
            }
        }
    }


}