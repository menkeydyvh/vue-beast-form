import type { ComponentInternalInstance } from "vue"
import type { RuleType } from './types'

export enum beastName {
    BASE = "BeastForm",
    BASEITEM = "BeastItem",
    BASERULE = "BeastRule",
};

/**
 * ES6 深拷贝 终极版
 * @param obj 
 * @param hash 
 * @returns 
 */
const realizeCloneDeep = (obj: any, hash = new WeakMap()) => {
    if (!isObject(obj)) {
        return obj
    }

    if (hash.has(obj)) { // 避免成环
        return hash.get(obj)
    }

    const type = [Date, RegExp, Set, Map, WeakMap, WeakSet, Array]
    if (type.includes(obj.constructor)) {
        return new obj.constructor(obj)
    }

    const allDesc = Object.getOwnPropertyDescriptors(obj) // 遍历传入参数所有键的特性
    const cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc) // 继承原型
    hash.set(obj, cloneObj)

    for (let key of Reflect.ownKeys(obj)) {
        // Reflect.ownKeys(obj)可以拷贝不可枚举属性和Symbol类型
        // 注意：writable 为 false 的属性会赋值失败，因此 writable 为 false 的属性是浅拷贝
        cloneObj[key] = isObject(obj[key]) ? realizeCloneDeep(obj[key], hash) : obj[key]
    }

    return cloneObj
}

/**
 * 判断{} 对象
 * @param data 
 * @returns 
 */
export const isObject = (data: any): boolean => {
    return typeof data === "object" && Object.prototype.toString.call(data) === '[object Object]'
}

/**
 * 获取父级 name
 * @param parent 
 * @param name 
 * @returns 
 */
export const getParentCompnent = (parent: ComponentInternalInstance, name: string): ComponentInternalInstance => {
    if (parent.type.name === name) {
        return parent
    } else if (parent.uid === 1) {
        return null;
    } else {
        return getParentCompnent(parent.parent, name)
    }
}

/**
   * 生成随机字符串
   * @param len  几位
   * @returns 
   */
export const randomId = (len = 8, prefix = "jl"): string => {
    let rdmString = '';
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return `${prefix}${rdmString.substr(0, len)}`
}

/**
 * 根据key对应的值获取对象
 * @param rules 
 * @param value 
 * @param key 
 * @returns 
 */
export const loopRule = (rules: RuleType[], value: any, callback: Function, key = 'field') => {
    rules.forEach((item, index) => {
        if (item[key] === value) {
            return callback({ item, index, rules })
        }

        if (item?.children) {
            return loopRule(item.children as RuleType[], value, callback, key)
        }
    })
}

interface CallbackItemType<T> { item: T, index: number, ary: T[] }

/**
 * 动态循环遍历
 * @param ary 
 * @param value 
 * @param callback 
 * @param search 
 */
export const searchLoop = <T>(ary: T[], value: any, callback: (curData: CallbackItemType<T>, parentData: CallbackItemType<T>) => void, parent: CallbackItemType<T>, search = { key: "field", children: "children" }) => {
    ary.forEach((item, index) => {
        if (item[search.key] === value) {
            return callback({ item, index, ary }, parent)
        }

        if (item?.[search.children]) {
            return searchLoop(item[search.children] as T[], value, callback, {
                item, index, ary
            }, search)
        }
    })
}

/**
 * 简单的处理一下 后续在复杂处理
 * @param od 
 * @param nd 
 * @returns 
 */
const mergeObject = <T>(od: T, nd: T) => {
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
export const deepCopy = <T>(data: T): T => {
    return realizeCloneDeep(data);
}

/**
 * 重新处理值
 * @param value
 * @returns 
 */
export const newValue = <T>(value: T): T => {
    if (typeof value === 'object') {
        return deepCopy(value)
    } else {
        return value
    }
}

/**
 * 首字母大写
 * @param str 
 * @returns 
 */
export const firstToUpper = (str: string): string => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}
/**
 * 首字母小写
 * @param str 
 * @returns 
 */
export const firstToLower = (str: string): string => {
    return str.slice(0, 1).toLowerCase() + str.slice(1);
}

/**
 * on上的事件名称转换为props上的事件名称
 * @param str 
 * @returns 
 */
export const onToPropsName = (str: string): string => {
    return `on${firstToUpper(str)}`;
}

/**
 * props上的事件名称转换为on上的事件名称
 * @param str 
 * @returns 
 */
export const propsToOnName = (str: string): string => {
    return firstToLower(str.slice(2));
}

/**
 * 定义处理方法的前缀
 */
const ruleFunTag = "~~RFTAG-START~";

/**
 * 字符串规则转换成对象
 * @param str 
 * @returns 
 */
export const ruleParse = (str: string): RuleType | RuleType[] => {
    return JSON.parse(str, function (_k, v) {
        if (typeof v === 'string' && v.indexOf(ruleFunTag) === 0) {
            return new Function(`return ${v.slice(ruleFunTag.length)}`)();
        }
        return v
    })
}
/**
 * 对象规则转化成字符串
 * @param rules 
 * @param space 
 * @returns 
 */
export const ruleStringify = (rules: RuleType | RuleType[], space?: number) => {
    return JSON.stringify(rules, function (_k, v) {
        if (typeof v === 'function') {
            return ruleFunTag + v.toString();
        }
        return v;
    }, space)
}


export default {
    deepCopy,
    searchLoop,
    randomId,
    ruleParse,
    ruleStringify,
}