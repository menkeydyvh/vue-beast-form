import { RuleType } from '../types/index'

export const getArrayRule = (rules: Array<any>, value: any, key: string = 'field'): RuleType | null => {
    let length = 0;
    if (Array.isArray(rules)) {
        length = rules.length
        let result = null;
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
        return result;
    }
    return null;
}

export const updateRule = (oData: any, nData: any) => {
    if (oData && nData) {
        for (let key in nData) {
            oData[key] = nData[key]
        }
    }
}

export const deepCopy = (data: any): any => {
    return JSON.parse(JSON.stringify(data))
}

export const isObject = (data: any): boolean => {
    return Object.prototype.toString.call(data) === '[object Object]'
}

export default {
    getArrayRule,
    isObject,
    updateRule,
    deepCopy,
}