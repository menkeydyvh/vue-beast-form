import { h, resolveDynamicComponent, VNodeProps, Slot } from 'vue'
import { Rule } from '../types/index'

/**
 * 
 * 渲染
 * @param {String} tag 
 * @param {Object} props 
 * @param {Object|Array} slot 
 * @returns 
 */
const render = (tag: string, props: VNodeProps, slot: Slot) => h(resolveDynamicComponent(tag) as any, props, slot,)


/**
 * 处理rule children
 * @param {Array} children 
 * @returns 
 */
const renderChildren = (children: Array<Rule>) => {
    let slots: any;
    if (children) {
        if (Array.isArray(children)) {
            slots = {};
            const slotAry: object = {};
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
const renderItem = (rule: Rule) => render(rule.type, { ...rule.props }, renderChildren(rule.children))



/**
 * 渲染 rules
 * @param {Array} ruleBase
 * @returns 
 */
export const renderRule = (ruleBase: Rule) => renderItem(ruleBase)
