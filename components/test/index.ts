import { defineComponent, getCurrentInstance, toRefs, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import FormFactory from './form'
import { RuleFactory } from './rule'
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
            const vm = getCurrentInstance() as any
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

            // 对emits的处理  runtime-core.esm-bundler.js:38 [Vue warn]: Extraneous non-emits event listeners (divBtnClick) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option. 
            // 目前还未成功
            RuleFactory.changeEmits = (action, name) => {
                let idx = emits.findIndex(item => item === name)
                if (action === 'add') {
                    if (idx === -1) {
                        emits.push(name)
                        vm.emitsOptions[name] = null
                    }
                } else if (action === 'del') {
                    if (idx != -1) {
                        emits.splice(idx, 1)
                        delete vm.emitsOptions[name]
                    }
                }
            }

            return () => rf.render()
        },
    });

}
