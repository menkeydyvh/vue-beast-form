import { defineComponent, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { FormFactory, modelValue } from './form'
import { RuleFactory } from './rule'
import type Api from './api'
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
            api: { type: Object as PropType<Api> },
            rule: { type: Array as PropType<Array<RuleType>>, required: true },
            modelValue: { default: null },
            option: { type: Object as PropType<PropsOptionType> },
            disabled: { type: Boolean },
        },
        emits,
        setup(_, { emit }) {
            const rf = new FormFactory()

            onMounted(() => {
                rf.addVm()
            });

            onBeforeUnmount(() => {
                rf.delVm()
            })

            nextTick(() => {

                RuleFactory.onChangeField = function (field, value) {
                    emit("changeField", field, value)
                }

                console.log(modelValue)
                emit("update:api", FormFactory.api)
                emit("update:modelValue", modelValue)
            })
            
            watch(modelValue, () => {
                emit("update:modelValue", modelValue)
            }, { deep: true })

            return () => rf.render()
        },
    });

}
