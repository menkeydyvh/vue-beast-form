import { h, resolveDynamicComponent, withDirectives, resolveDirective } from 'vue'
import { isObject } from '../tool'
import { defaultName } from './config'
import type { Slot, Component, VNode } from 'vue'
import type { RuleType } from '../types'

const mergeStyle = (oStyle: any, nStyle: any): any => {
    let result = {};
    if (oStyle) {
        if (typeof oStyle === 'string') {
            oStyle.split(';').forEach(styleStr => {
                let ssAry = styleStr.split(':');
                if (ssAry.length === 2) {
                    result[ssAry[0].trim()] = ssAry[1].trim()
                }
            })
        } else if (isObject(oStyle)) {
            result = { ...oStyle }
        }
    }
    if (nStyle) {
        if (typeof nStyle === 'string') {
            nStyle.split(';').forEach(styleStr => {
                let ssAry = styleStr.split(':');
                if (ssAry.length === 2) {
                    result[ssAry[0].trim()] = ssAry[1].trim()
                }
            })
        } else if (isObject(nStyle)) {
            result = { ...result, ...nStyle }
        }
    }
    return result;
}

/**
 * 使用指令
 * @param vNode 
 * @param rule 
 * @returns 
 */
const directivesRender = (vNode: VNode, rule: RuleType) => {
    if (rule.directives) {
        const directives = rule.directives.map(item => {
            if (Array.isArray(item)) {
                if (typeof item[0] === 'string') {
                    item[0] = resolveDirective(item[0])
                }
                return item
            }
        }).filter(item => item)
        return withDirectives(vNode, directives as any)
    } else {
        return vNode
    }
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
    if (rule.display === 'if') {
        return undefined;
    }

    if (rule.display === 'show') {
        props.style = mergeStyle(props.style, {
            display: "none"
        });
    }

    let formItemVNode = null, vNode = h(resolveDynamicComponent(tag) as Component, props, slot)

    if (rule.native && rule.vModelKey) {
        const formItemProps: any = {
            style: rule.display === 'show' ? "display: none" : undefined,
        }, formItemSlot = {
            default: () => vNode
        };
        formItemProps[defaultName.formItemPropName] = rule.field;
        if (rule.props.disabled !== true) {
            if (rule.validate) {
                if (Array.isArray(rule.validate)) {
                    if (rule.validate.find(item => item.required)) {
                        formItemProps.required = true
                    }
                }
                formItemProps['rules'] = rule.validate
            }
        }
        if (typeof rule.title === 'string') {
            formItemProps[defaultName.formItemPropLabel] = rule.title
        } else {
            formItemSlot[defaultName.formItemSlotTitle] = () => renderItem(rule.title as RuleType)
        }

        formItemVNode = h(resolveDynamicComponent(defaultName.formItem) as Component, formItemProps, formItemSlot)
    }

    return directivesRender(formItemVNode ? formItemVNode : vNode, rule)
}

/**
 * 处理rule children
 * @param {Array} children 
 * @returns 
 */
const renderChildren = (children: Array<RuleType | string>): any => {
    const slots: any = {}, slotAry: any = {};
    children.forEach(child => {
        let slotsKey = 'default', isObj = false;
        if (typeof child !== 'string') {
            slotsKey = child.slot ? child.slot : slotsKey;
            isObj = true
        }

        if (!slotAry[slotsKey]) {
            slotAry[slotsKey] = []
        }
        slotAry[slotsKey].push(isObj ? renderItem(child as RuleType) : child)
    })
    for (let key in slotAry) {
        slots[key] = () => slotAry[key]
    }
    return slots
}

/**
 * 处理rule渲染
 * @param {Object} rule 
 * @returns 
 */
const renderItem = (rule: RuleType) => {
    let slot = undefined;

    if (rule.children && rule.children.length) {
        slot = renderChildren(rule.children)
    }

    return render(rule.type, { ...rule.props }, slot, rule)
}




/**
 * 渲染 rules
 * @param {Array} ruleBase
 * @returns 
 */
export const renderRule = (ruleBase: RuleType) => renderItem(ruleBase)

