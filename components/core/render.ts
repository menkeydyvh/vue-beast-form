import { h, resolveDynamicComponent } from 'vue'
import { isObject } from '../tool'
import type { Slot, Component } from 'vue'
import type { RuleType } from '../types'

const propsStyle = (oStyle: any, nStyle: any): string => {
    let result = '';
    if (isObject(oStyle)) {

    }
    return result;
}


/**
 * 
 * 渲染
 * @param {String} tag 
 * @param {Object} props 
 * @param {Object|Array} slot 
 * @returns 
 */
const render = (tag: string, props: any, slot: Slot, rule: RuleType) => {
    if (rule.display === 'show') {
        if (props.style) {
            
        }
    }

    // 后续处理指令
    const vNode = h(resolveDynamicComponent(tag) as Component, props, slot)

    return vNode
}

/**
 * 处理rule children
 * @param {Array} children 
 * @returns 
 */
const renderChildren = (children: Array<RuleType>): any => {
    let slots: any = null;
    if (children) {
        if (Array.isArray(children)) {
            slots = {};
            const slotAry: any = {};
            children.forEach(child => {
                let slotsKey: string = 'default', isObj: boolean = typeof child === 'object';
                if (isObj) {
                    slotsKey = child.slot ? child.slot : slotsKey;
                }
                if (!slotAry[slotsKey]) {
                    slotAry[slotsKey] = []
                }
                slotAry[slotsKey].push(isObj ? renderItem(child) : child)
            })
            for (let key in slotAry) {
                slots[key] = () => slotAry[key]
            }
        }
    }
    return slots
}

/**
 * 处理rule渲染
 * @param {Object} rule 
 * @returns 
 */
const renderItem = (rule: RuleType) => {
    return render(rule.type, { ...rule.props }, renderChildren(rule.children as Array<RuleType>), rule)
}




/**
 * 渲染 rules
 * @param {Array} ruleBase
 * @returns 
 */
export const renderRule = (ruleBase: RuleType) => renderItem(ruleBase)

