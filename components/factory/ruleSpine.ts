import { h, resolveDynamicComponent } from 'vue'
import { formDataComponentKey, formDataComponentDefaultValue, formDataComponentChangeKeyEvent, defaultName } from '../core/config'
import type { Directive } from 'vue'
import type { RuleValidateType, RuleType } from '../types'

export default class ruleSpine {
    private type?: any;
    // 与当前组件相关
    public props?: any;
    // form-item相关
    //这个比较特殊,用来做规则对象查找的字段
    public field?: string;
    public title?: string | RuleType;
    public value?: any;
    public vModelKey?: string | string[];
    public vModelKeyValueEvent?: string | string[];
    public vModelKeyDefaultValue?: any;
    public validate?: Array<RuleValidateType>;
    public native?: Boolean;
    // 如果是表单输入控件会设置在form-item 
    // 如果非form-item则设置在props中层级大于props但不一样的时候会合并
    public class?: any;
    public style?: any;
    public attrs?: any;
    // 布局相关
    public children?: Array<ruleSpine | string>;
    public slot?: string;
    public display?: 'show' | 'if';
    // 指令
    public directives?: Array<[Directive | string] | [Directive | string, any] | [Directive | string, any, string] | [Directive | string, any, string, Record<string, boolean>]>;
    // 事件会覆盖props内同名事件处理
    public on?: any;


    public onChangeValue?: Function;

    constructor(rule: RuleType) {
        this.type = resolveDynamicComponent(rule.type)
        this.props = rule.props;
        this.field = rule.field;
        this.title = rule.title;
        this.value = rule.value;
        this.vModelKey = rule.vModelKey;
        this.vModelKeyDefaultValue = rule.vModelKeyDefaultValue;
        this.validate = rule.validate;
        this.native = rule.native;
        this.class = rule.class;
        this.style = rule.style;
        this.attrs = rule.attrs;
        this.slot = rule.slot;
        this.display = rule.display;
        this.directives = rule.directives;
        this.on = rule.on;
        this.setChildren(rule.children)
        this.parseVModel();
    }
    setProps(props: any) {
        this.props = props;
    }
    setTitle(title: string | RuleType) {
        this.title = title;
    }
    setValue(value: any) {
        this.value = value;
    }
    setNative(native: any) {
        this.native = native;
    }
    setChildren(children: Array<string | RuleType>) {
        if (children) {
            this.children = children.map(item => {
                if (typeof item === 'object') {
                    return new ruleSpine(item)
                } else {
                    return item
                }
            })
        } else {
            this.children = undefined
        }
    }
    /**
     * 对v-model的解析处理
     */
    private parseVModel() {
        if (typeof this.type === 'object') {
            const { name, props } = this.type, propsKeys = props ? Object.keys(props || {}) : [];
            let defaultModelKey: string | string[] = this.vModelKey || formDataComponentKey[name] || formDataComponentKey['default'],
                defaultEvents: any = null,
                defaultValue: any = this.vModelKeyDefaultValue || null,
                isBool = true;

            // 默认先从配置中取
            if (formDataComponentChangeKeyEvent[name]) {
                defaultEvents = formDataComponentChangeKeyEvent[name]
            }
            if (formDataComponentDefaultValue[name]) {
                defaultValue = formDataComponentDefaultValue[name]
            }
            if (Array.isArray(defaultModelKey)) {
                if (!defaultEvents) {
                    defaultEvents = defaultModelKey.map(item => `onUpdate:${item}`)
                }
                if (!defaultValue) {
                    defaultValue = defaultModelKey.map(() => null)
                }
                defaultModelKey.forEach((key, itemIndex) => {
                    if (!propsKeys.includes(key) && propsKeys.includes(defaultEvents[itemIndex])) {
                        isBool = false
                    }
                })
            } else {
                if (!defaultEvents) {
                    defaultEvents = `onUpdate:${defaultModelKey}`
                }
                if (!defaultValue) {
                    defaultValue = null
                }
                if (!(propsKeys.includes(defaultModelKey) && propsKeys.includes(defaultEvents))) {
                    isBool = false;
                }
            }

            this.vModelKey = isBool ? defaultModelKey : null;
            this.vModelKeyValueEvent = isBool ? defaultEvents : null;
            this.vModelKeyDefaultValue = isBool ? defaultValue : null;
        } else {
            this.vModelKey = null;
            this.vModelKeyValueEvent = null;
            this.vModelKeyDefaultValue = null;
        }

    }
    /**
     * 处理children位置的渲染
     * @returns 
     */
    private childrenRender() {
        const tagSlot = {}, childSlot = {
            default: []
        };
        this.children.forEach(child => {
            if (typeof child === 'object') {
                if (child.slot) {
                    if (!childSlot[child.slot]) {
                        childSlot[child.slot] = []
                    }
                    childSlot[child.slot].push(child.render())
                } else {
                    childSlot.default.push(child.render())
                }
            } else {
                childSlot.default.push(child)
            }
        })

        for (let key in childSlot) {
            tagSlot[key] = () => childSlot[key]
        }
        return tagSlot;
    }
    render() {
        const self = this,
            tagProps = {
                ...this.props
            };

        if (this.vModelKey) {
            // 输入组件可记录值
            if (Array.isArray(this.vModelKey)) {

            } else {
                tagProps[this.vModelKey] = this.value;
                tagProps[this.vModelKeyValueEvent as string] = function () {
                    // self.onChangeValue && self.onChangeValue(arguments[0])
                };
            }
        }


        return h(this.type, tagProps, this.childrenRender())
    }
}