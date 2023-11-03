import { defineComponent, getCurrentInstance, toRaw } from 'vue'
import FormFactory from './form'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType, ApiType } from '../types'

const baseEmits = ["changeField", "update:modelValue", "update:api", "mounted", 'unmounted']

export interface CreateFactoryConfigType {
    // 本组件的名称
    name: string
    // 使用的框架名称
    framework: string
    // 注册自定义指令
    directives: any
    // 注册自定义emits
    emits: string[]
}

export default function createFactory(config: CreateFactoryConfigType) {

    return defineComponent({
        name: config.name,
        directives: config.directives,
        props: {
            api: { type: Object as PropType<ApiType> },
            name: { type: String },
            rule: { type: Array as PropType<Array<RuleType>>, required: true },
            modelValue: { type: Object, },
            option: { type: Object as PropType<PropsOptionType> },
            disabled: { type: Boolean },
        },
        emits: [...baseEmits, ...config.emits],
        watch: {
            option: {
                handler() {
                    this.rf.initOption(this.option);
                    this.$forceUpdate();
                },
                deep: true,
            },
            rule: {
                handler() {
                    this.rf.initModelValue(this.modelValue);
                    this.rf.initRule(this.rule);
                    this.$forceUpdate();
                },
                deep: true,
            },
            disabled: {
                handler() {
                    this.rf.initDisabled(this.disabled);
                },
            },
            modelValue: {
                handler() {
                    this.rf.updateModelValue(this.modelValue);
                },
                deep: true,
            },
            "rf.modelValue": {
                handler() {
                    this.$emit("update:modelValue", toRaw(this.rf.modelValue));
                },
                deep: true,
            },
        },
        data() {
            return {
                rf: null
            }
        },
        created() {
            const vm = getCurrentInstance();
            this.rf = new FormFactory(vm, config.framework);
            this.rf.initOption(this.option);
            this.rf.initModelValue(this.modelValue);
            this.rf.initRule(this.rule);
        },
        mounted() {
            this.rf.addVm();
            this.$nextTick(() => {
                this.$emit("update:api", this.rf.api.publishApi());
                this.$emit("update:modelValue", this.rf.modelValue);
                if (this.name) {
                    this.rf.cacheApi(this.name);
                }
                this.$emit('mounted');
            })
        },
        beforeUnmount() {
            this.rf.delVm();
            if (this.name) {
                this.rf.delCacheApi(this.name);
            }
            config.directives = {};
            config.emits = [];
        },
        unmounted() {
            this.$emit('unmounted');
        },
        render() {
            return this.rf.render();
        }
    });
}
