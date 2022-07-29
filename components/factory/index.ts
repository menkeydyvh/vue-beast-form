import { defineComponent, getCurrentInstance, toRefs, onMounted, onBeforeUnmount, onUnmounted, watch, nextTick } from 'vue'
import FormFactory from './form'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType, ApiType } from '../types'


const baseEmits = ["changeField", "update:modelValue", "update:api", "mounted", 'unmounted']

export interface CreateFactoryConfigType {
    name: string
    framework: string
    directives: any
    emits: string[]
}

export default function createFactory(config: CreateFactoryConfigType) {

    const component = defineComponent({
        name: config.name,
        directives: config.directives,
        props: {
            api: { type: Object as PropType<ApiType> },
            rule: { type: Array as PropType<Array<RuleType>>, required: true },
            modelValue: { default: null },
            option: { type: Object as PropType<PropsOptionType> },
            disabled: { type: Boolean },
        },
        emits: [...baseEmits, ...config.emits],
        setup(props, { emit }) {
            const vm = getCurrentInstance() as any,
                { modelValue, rule, option, disabled } = toRefs(props);
            const rf = new FormFactory(vm, config.framework)

            onMounted(() => {
                rf.addVm()
                nextTick(() => {
                    // 视图都被渲染之后
                    emit('mounted', rf.api.publishApi())
                })
            });

            onBeforeUnmount(() => {
                rf.delVm();
                config.directives = {}
                config.emits = []
            })

            onUnmounted(() => {
                emit('unmounted')
            })

            nextTick(() => {
                emit("update:api", rf.api.publishApi())
                emit("update:modelValue", rf.modelValue)
            })

            watch(option, () => {
                rf.initOption()
                vm.proxy.$forceUpdate()
            }, { deep: true })

            watch(disabled, () => {
                rf.initDisabled()
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
