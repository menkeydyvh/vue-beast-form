import { defineComponent } from 'vue'
import FormFactory from './form'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType } from '../types'

export const NAME = 'BeastForm'

const baseEmits = ["changeField", "update:modelValue", "update:api"];

export default function factory() {

    const emits = [...baseEmits];

    const component = defineComponent({
        name: NAME,
        components: {},
        directives: {},
        props: {
            api: { type: Object },
            rule: { type: Array as PropType<Array<RuleType>>, required: true },
            modelValue: { default: null },
            option: { type: Object as PropType<PropsOptionType> },
            disabled: { type: Boolean },
        },
        emits,
        data() {
            return {
                _rf: null
            }
        },
        watch: {
            disabled() {
                this.$data._rf.initDisabled()
            },
            option: {
                handler() {
                    this.$data._rf.initOption()
                    this.$forceUpdate()
                },
                deep: true
            },
            "rf.modelValue": {
                handler() {
                    this.$emit("update:modelValue", this.$data._rf.modelValue)
                },
                deep: true
            },
            "rule": {
                handler() {
                    this.$data._rf.initModelValue();
                    this.$data._rf.initRule()
                    this.$forceUpdate()
                },
                deep: true
            },
            modelValue: {
                handler() {
                    this.$nextTick(() => {
                        this.$data._rf.updateModelValue(this.modelValue)
                    })
                },
                deep: true
            }
        },
        render() {
            return this.$data._rf.render()
        },
        created() {
            this.$data._rf = new FormFactory(this.$)
        },
        mounted() {
            this.$data._rf.addVm()
            this.$nextTick(() => {
                this.$emit("update:api", this.$data._rf.api.publishApi())
                this.$emit("update:modelValue", this.$data._rf.modelValue)
            })
        },
        beforeUnmount() {
            emits.splice(0, emits.length)
            baseEmits.forEach(item => {
                emits.push(item)
            })
            this.$data._rf.delVm()
        }
    });
    return component
}
