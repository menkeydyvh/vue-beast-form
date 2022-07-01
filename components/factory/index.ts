import { defineComponent, getCurrentInstance, toRefs, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import FormFactory from './form'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType } from '../types'

export const NAME = 'JsonLayout'

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
        setup(props, { emit }) {
            const vm = getCurrentInstance() as any,
                { modelValue, rule, option } = toRefs(props);

            const rf = new FormFactory(vm)

            onMounted(() => {
                rf.addVm()
            });

            onBeforeUnmount(() => {
                emits.splice(0, emits.length)
                baseEmits.forEach(item => {
                    emits.push(item)
                })
                rf.delVm()
            })

            nextTick(() => {
                emit("update:api", rf.api)
                emit("update:modelValue", rf.modelValue)
            })

            watch(option, () => {
                rf.initOption()
                vm.ctx.$forceUpdate()
            }, { deep: true })

            watch(rf.modelValue, () => {
                emit("update:modelValue", rf.modelValue)
            }, { deep: true })

            watch(rule, () => {
                rf.initModelValue();
                rf.initRule()
                vm.ctx.$forceUpdate()
            }, { deep: true })

            watch(modelValue, () => {
                nextTick(() => {
                    rf.updateModelValue(modelValue.value)
                })
            }, { deep: true })

            return () => rf.render()
        },


    });
    return component
}
