import { defineComponent, toRefs, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import FormFactory from './form'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType } from '../types'


export default function factory() {

    const name = 'JsonLayout',
        emits = ["changeField", "update:modelValue", "update:api"];


    return defineComponent({
        name,
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
            const { modelValue } = toRefs(props)
            const rf = new FormFactory()

            onMounted(() => {
                rf.addVm()

            });

            onBeforeUnmount(() => {
                rf.delVm()
            })

            nextTick(() => {
                emit("update:api", rf.api)
                emit("update:modelValue", rf.modelValue)
            })

            if (!(modelValue.value === undefined || modelValue.value === null)) {
                watch(modelValue, () => {
                    rf.updateModelValue(modelValue.value)
                }, { deep: true })
            }

            watch(rf.modelValue, () => {
                emit("update:modelValue", rf.modelValue)
            }, { deep: true })

            return () => rf.render()
        },
    });

}
