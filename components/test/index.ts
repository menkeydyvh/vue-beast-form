import { reactive, defineComponent, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { FormFactory, modelValue } from './form'
import { RuleFactory } from './rule'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType } from '../types'


export default function factory() {

    const name = 'JsonLayout',
        emits = ["changeField", "update:modelValue"];


    return defineComponent({
        name,
        components: {},
        directives: {},
        props: {
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
                const formValue = reactive({ ...modelValue })
                
                RuleFactory.onChangeField = function (field: string, value: any, key: string) {
                    formValue[field] = value;
                    emit("changeField", field, value, key)
                    emit("update:modelValue", formValue)
                }

                emit("update:modelValue", formValue)
            })


            return () => rf.render()
        },


    });

}
