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

/**
 * ES6 深拷贝 终极版
 * @param obj 
 * @param hash 
 * @returns 
 */
const realizeCloneDeep = (obj: any, hash = new WeakMap()) => {
    if (!(typeof obj === "object" && obj != null)) {
        return obj
    }

    if (hash.has(obj)) { // 避免成环
        return hash.get(obj)
    }

    const type = [Date, RegExp, Set, Map, WeakMap, WeakSet]
    if (type.includes(obj.constructor)) {
        return new obj.constructor(obj)
    }

    const allDesc = Object.getOwnPropertyDescriptors(obj) // 遍历传入参数所有键的特性
    const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc) // 继承原型
    hash.set(obj, cloneObj)

    for (let key of Reflect.ownKeys(obj)) {
        // Reflect.ownKeys(obj)可以拷贝不可枚举属性和Symbol类型
        // 注意：writable 为 false 的属性会赋值失败，因此 writable 为 false 的属性是浅拷贝
        cloneObj[key] = (typeof obj[key] === "object" && obj[key] != null) ? realizeCloneDeep(obj[key], hash) : obj[key]
    }

    return cloneObj
}

export const deepCopy = (data: any): any => {
    return realizeCloneDeep(data);
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