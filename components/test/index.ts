import { defineComponent, watch, onMounted, onBeforeUnmount, onUpdated, computed, nextTick } from 'vue'
import RuleFactory from './rule'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType, ApiFnType } from '../types'


export default function factory() {

    const name = 'JsonLayout',
        baseFormRefs = 'form',
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
        setup(props, { emit }) {
            
            const rf = new RuleFactory()

            onMounted(() => { });

            onUpdated(() => { })

            onBeforeUnmount(() => { })

            return () => rf.render();
        },


    });

}
