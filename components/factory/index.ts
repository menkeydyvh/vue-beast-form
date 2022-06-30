import { defineComponent, getCurrentInstance, toRefs, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import FormFactory from './form'
// import { RuleFactory } from './rule'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType } from '../types'

export const NAME = 'JsonLayout'

export default function factory() {

    const emits = ["changeField", "update:modelValue", "update:api"];

    return defineComponent({
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
                { modelValue, rule } = toRefs(props),
                rf = new FormFactory(vm)

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

            watch(rule, () => {
                vm.ctx.$forceUpdate()
                rf.initRule()
            }, { deep: true })

            return () => rf.render()
        },


    });

}
