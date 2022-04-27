import { resolveDynamicComponent, h } from 'vue'
import type { VNode } from 'vue'

interface RuleValidateType {
    type?: string;
    required?: boolean;
    message?: string;
    trigger?: string;
}

export default class RuleFactory {
    // 必须
    public readonly type: string;
    // 与当前组件相关
    public props: {};
    // form-item相关
    //这个比较特殊,用来做规则对象查找的字段
    public field?: string;
    public title?: string | RuleFactory;
    public value?: any;
    public vModelKey?: string | string[];
    public validate?: Array<RuleValidateType>;
    public native?: Boolean;
    // 布局相关
    public children?: (RuleFactory | string)[];
    public slot?: string;
    public display?: 'show' | 'if';

    private cacheTag: any;

    constructor(rule: RuleFactory) {
        this.type = rule.type
        this.field = rule.field
        this.props = { ...rule.props }
        this.title = rule.title
        this.value = rule.value
        this.vModelKey = rule.vModelKey
        this.validate = rule.validate
        this.native = rule.native
        this.children = rule.children?.map(child => {
            if (typeof child === 'string') {
                return child
            } else {
                return new RuleFactory(child)
            }
        }) || []
        this.slot = rule.slot
        this.display = rule.display
    }
    setValue(value: any) {
        this.value = value;
        this.render();
    }
    renderChildren(): (string | VNode)[] {
        return this.children.map(child => {
            if (typeof child === 'string') {
                return child
            } else {
                return child.render() as VNode
            }
        })
    }
    render() {
        let props = { ...this.props }, slot = undefined;
        if (!this.cacheTag) {
            this.cacheTag = resolveDynamicComponent(this.type)
        }

        if (this.children && this.children.length) {
            slot = this.renderChildren()
        }

        return h(this.cacheTag, props, slot)
    }

}