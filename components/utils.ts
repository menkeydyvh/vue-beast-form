import { Rule } from '../types/index'

export const getArrayRule = (rules: Array<Rule>, value: any, key: string = 'field'): Rule => {
    let result: Rule, length: number = 0;
    if (Array.isArray(rules)) {
        length = rules.length
        for (let i: number = 0; i < length; i++) {
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

export const isObject = (data: any): boolean => {
    return Object.prototype.toString.call(data) === '[object Object]'
}

export default {
    getArrayRule,
    isObject,
}