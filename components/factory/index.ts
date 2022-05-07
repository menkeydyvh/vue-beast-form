import type { ComponentInternalInstance } from 'vue'
import { defaultName } from '../core/config'
import type { RuleType, PropsOptionType, ApiFnType } from '../types'
import { isObject, loopRule, deepCopy, firstToUpper } from '../tool'
import ruleSpine from './ruleSpine'

export default class factory {
    public rule: [RuleType];
    public bRule: ruleSpine;


    constructor(vm: ComponentInternalInstance) {
        this.rule = vm.props.rule as [RuleType]
        this.init();
    }
    init() {
        this.bRule = new ruleSpine({
            type: defaultName.form
        })
        
        this.bRule.setChildren(this.rule)

        // this.rule = new 
    }
    render() {
        return this.bRule.render();
    }

}