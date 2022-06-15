import { h, resolveDynamicComponent, withDirectives, resolveDirective } from 'vue'
import type config from '../config'
import type { Slot, Component, VNode } from 'vue'
import type { RuleType, DefaultName } from '../types'

export default class render {

    public defaultName: DefaultName = {};

    public isForm: boolean = true;

    constructor(config: config) {
        this.defaultName = config.defaultName;
    }

    /**
     * isForm处理
     * @param isForm 
     */
    setIsForm(isForm: boolean) {
        this.isForm = isForm;
    }


    /**
     * 使用指令
     * @param vNode 
     * @param rule 
     * @returns 
     */
    _directivesRender = (vNode: VNode, rule: RuleType) => {
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
     * 渲染
     * @param {String} tag 
     * @param {Object} props 
     * @param {Object|Array} slot 
     * @returns 
     */
    _render = (tag: string, props: any, slot: Slot, rule: RuleType) => {
        if (rule.display === false) {
            return undefined;
        }

        const ragComponent: any = resolveDynamicComponent(tag)

        if (!rule.vModelKey) {
            props = { ...props, ...rule.attrs };
            if (rule.style) {
                props.style = rule.style
            }
            if (rule.class) {
                props.class = rule.class
            }
        }

        if (typeof ragComponent === "string") {
            // 避免一些元素上出现disabled
            delete props.disabled
        }

        let formItemVNode = null, vNode = h(ragComponent, props, slot)

        if (this.isForm && rule.title !== false && rule.vModelKey) {
            const formItemProps: any = {
                ...rule.attrs
            }, formItemSlot = {
                default: () => vNode
            };
            if (rule.class) {
                formItemProps.class = rule.class;
            }
            if (rule.style) {
                formItemProps.style = rule.style;
            }
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
            if (typeof rule.title === 'object') {
                formItemSlot[this.defaultName.formItemSlotTitle] = () => this._renderItem(rule.title as RuleType)
            } else {
                formItemProps[this.defaultName.formItemPropLabel] = rule.title
            }

            formItemVNode = h(resolveDynamicComponent(this.defaultName.formItem) as Component, formItemProps, formItemSlot)
        }

        return this._directivesRender(formItemVNode ? formItemVNode : vNode, rule)
    }

    /**
     * 处理rule children
     * @param {Array} children 
     * @returns 
     */
    _renderChildren = (children: Array<RuleType | string>): any => {
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
            slotAry[slotsKey].push(isObj ? this._renderItem(child as RuleType) : child)
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
    _renderItem = (rule: RuleType) => {
        let slot = undefined;

        if (rule.children && rule.children.length) {
            slot = this._renderChildren(rule.children)
        }

        return this._render(rule.type, { ...rule.props }, slot, rule)
    }

    /**
     * 渲染 rules
     * @param {Array} ruleBase
     * @returns 
     */
    renderRule = (ruleBase: RuleType) => this._renderItem(ruleBase)

}
