import { defineComponent, getCurrentInstance, toRefs, onMounted, onBeforeUnmount, onUnmounted, watch, nextTick } from 'vue'
import FormFactory from './form.js'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType, ApiType } from '../types'
import { beastName } from '../tool.js'

export default defineComponent({
    name: beastName.BASE,
    props: {
        api: { type: Object as PropType<ApiType> },
        name: { type: String },
        rule: { type: Array as PropType<Array<RuleType>>, required: true },
        modelValue: { default: null },
        option: { type: Object as PropType<PropsOptionType> },
        disabled: { type: Boolean },
    },
    emits: ["changeField", "update:modelValue", "update:api", "mounted", 'unmounted'],
    setup(props, { emit }) {
        const vm = getCurrentInstance(),
            { modelValue, rule, option, disabled, name } = toRefs(props);
        const rf = new FormFactory(vm)

        onMounted(() => {
            rf.addVm()

            nextTick(() => {
                // 视图都被渲染之后
                emit('mounted', rf.api.publishApi())
                if (name.value) {
                    rf.cacheApi(name.value);
                }
            })
        });

        onBeforeUnmount(() => {
            rf.delVm();
            if (name.value) {
                rf.delCacheApi(name.value);
            }
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
            vm.proxy.$forceUpdate()
        }, { deep: true })

        watch(modelValue, () => {
            nextTick(() => {
                rf.updateModelValue(modelValue.value)
            })
        }, { deep: true })

        return {
            fApi: rf.api.publishApi(),
            render() {
                return rf.render()
            }
        }
    },
    render() {
        return this.render();
    },
});
