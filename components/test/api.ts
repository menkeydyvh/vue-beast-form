import { baseInject, modelKeyAry } from "./rule"
import type renderFactory from './render'


const searchLoop = (
    ary: renderFactory[],
    value: any,
    callback: (data: {
        item: renderFactory,
        index: Number,
        ary: renderFactory[]
    }
    ) => void) => {
    ary.forEach((item, index) => {
        if (typeof item != 'string') {
            if (item.rule.field === value) {
                return callback({ item, index, ary })
            }

            if (item.children) {
                return searchLoop(item.children as renderFactory[], value, callback)
            }
        }
    })
}

var rfs: renderFactory[]

export default class apiFactory {

    constructor(renderFactorys?: renderFactory[]) {
        this._updateRfs(renderFactorys)
    }

    /**
     * 更新记录数组
     * @param renderFactorys 
     */
    _updateRfs(renderFactorys: renderFactory[]) {
        rfs = renderFactorys || []
    }

    /**
      * 通过field检索规则  支持xxx.xxx层级方式
      * @param field 
      * @returns 
      */
    getRule(field: string) {
        let result: renderFactory = null;
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
                    searchLoop(result.children as renderFactory[], fields[idx], ({ item }) => {
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
        const rf = this.getRule(field)
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
        const rf = this.getRule(field)
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
        const rf = this.getRule(field)
        if (rf) {
            for (let key in value) {
                rf.props[key] = value[key]
            }
        }
    }

    /**
     * 检测是不是model的key
     * @param field 
     * @returns 
     */
    isModelKey(field: string) {
        return modelKeyAry.includes(field)
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
            const data = {}
            modelKeyAry.forEach(key => {
                data[key] = this.getFormData(key)
            })
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
            modelKeyAry.forEach(key => {
                this.resetFormData(key);
            })
        }
    }

}