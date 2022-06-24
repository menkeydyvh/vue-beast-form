import { defineComponent, onMounted, onBeforeUnmount, } from 'vue'
import RuleFactory from './rule'
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
        setup() {
            const rf = new RuleFactory()
            onMounted(() => {
                rf.addVm()
            });
            onBeforeUnmount(() => {
                rf.delVm()
            })
            return () => rf.render();
        },


    });

}
