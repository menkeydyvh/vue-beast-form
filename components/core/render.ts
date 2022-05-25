import { h, resolveDynamicComponent, withDirectives, resolveDirective } from 'vue'
import { mergeStyle, mergeClassName } from '../tool'
import type config from '../config'
import type { Slot, Component, VNode } from 'vue'
import type { RuleType, DefaultName } from '../types'

export default class render {
    public defaultName: DefaultName;

    constructor(config: config) {
        this.defaultName = config.defaultName;
    }

    /**
     * 使用指令
     * @param vNode 
     * @param rule 
     * @returns 
     */
    directivesRender = (vNode: VNode, rule: RuleType) => {
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
    render = (tag: string, props: any, slot: Slot, rule: RuleType) => {
        if (rule.display === 'if') {
            return undefined;
        }
        const ragComponent: any = resolveDynamicComponent(tag)

        if (!rule.vModelKey) {
            // 处理attrs
            props = { ...props, ...rule.attrs };
            // 处理style
            props.style = mergeStyle(props.style || {}, rule.style)
            // 处理class
            props.class = mergeClassName(props.class || '', rule.class)

            if (!props.class) {
                delete props.class
            }
            if (rule.display === 'show') {
                props.style.display = "none"
            }
            if (Object.keys(props.style).length === 0) {
                delete props.style;
            }
        }

        let formItemVNode = null, vNode = h(ragComponent, props, slot)

        if (rule.native && rule.vModelKey) {
            const formItemProps: any = {
                ...rule.attrs
            }, formItemSlot = {
                default: () => vNode
            };
            if (rule.class) {
                formItemProps.class = rule.class;
            }
            formItemProps.style = mergeStyle({}, rule.style);
            formItemProps.style.display = rule.display === 'show' ? "none" : undefined;
            formItemProps[this.defaultName.formItemPropName] = rule.field;
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
                formItemProps[this.defaultName.formItemPropLabel] = rule.title
            } else {
                formItemSlot[this.defaultName.formItemSlotTitle] = () => this.renderItem(rule.title as RuleType)
            }

            formItemVNode = h(resolveDynamicComponent(this.defaultName.formItem) as Component, formItemProps, formItemSlot)
        }

        return this.directivesRender(formItemVNode ? formItemVNode : vNode, rule)
    }

    /**
     * 处理rule children
     * @param {Array} children 
     * @returns 
     */
    renderChildren = (children: Array<RuleType | string>): any => {
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
            slotAry[slotsKey].push(isObj ? this.renderItem(child as RuleType) : child)
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
    renderItem = (rule: RuleType) => {
        let slot = undefined;

        if (rule.children && rule.children.length) {
            slot = this.renderChildren(rule.children)
        }

        return this.render(rule.type, { ...rule.props }, slot, rule)
    }

    /**
     * 渲染 rules
     * @param {Array} ruleBase
     * @returns 
     */
    renderRule = (ruleBase: RuleType) => this.renderItem(ruleBase)

}
