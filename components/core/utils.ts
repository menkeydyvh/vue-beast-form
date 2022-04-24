import { RuleType } from '../types/index'
import { realizeCloneDeep, isObject } from '../tool'

/**
 * 根据key对应的值获取对象
 * @param rules 
 * @param value 
 * @param key 
 * @returns 
 */
export const getArrayRule = (rules: Array<any>, value: any, key: string = 'field'): RuleType | null => {
    let length = 0, result = null;
    if (Array.isArray(rules)) {
        length = rules.length
        for (let i = 0; i < length; i++) {
            if (rules[i][key] === value) {
                result = rules[i]
                break;
            }
            if (rules[i].children) {
                result = getArrayRule(rules[i].children, value, key)
                if (result) {
                    break;
                }
            }
        }
    }
    return result;
}

/**
 * 简单的处理一下 后续在复杂处理
 * @param od 
 * @param nd 
 * @returns 
 */
const mergeObject = (od: any, nd: any) => {
    if (Array.isArray(od)) {
        return [].concat(od, nd)
    } else if (isObject(od)) {
        return { ...od, ...nd }
    } else {
        return nd
    }
}

/**
 * 更新规则
 */
export const updateRule = (oData: any, nData: any, isMerge?: boolean) => {
    if (oData && nData) {
        if (isMerge) {
            for (let key in nData) {
                oData[key] = mergeObject(oData[key], nData[key])
            }
        } else {
            for (let key in nData) {
                oData[key] = nData[key]
            }
        }
    }
}

/**
 * 深拷贝
 * @param data 
 * @returns 
 */
export const deepCopy = (data: any): any => {
    return realizeCloneDeep(data);
}

export default {
    getArrayRule,
    updateRule,
    deepCopy,
}