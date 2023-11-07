<template>
    <component :is="coreComp" v-bind="coreProps">
        <template v-for="item in rule">
            <FormItemComp :rule="item" :modelValue="curValue" :api="api" @changeField="emitChangeField" />
        </template>
    </component>
</template>
<script setup lang="ts">
import { defineOptions, getCurrentInstance, computed, onMounted, onUnmounted, ref, h, watch } from 'vue'
import { RuleType, PropsOptionType, ApiType } from '../types'
import { LoaderFactory, globalCache } from './loader';
import { CreateFactoryConfigType } from '../factory';
import FormItemComp from './formItem.vue';
import apiFactory from './api';

interface CoreProps {
    api?: ApiType;
    name?: string;
    rule: RuleType[];
    modelValue?: Record<string, any>;
    option?: PropsOptionType;
    disabled?: boolean;
    config?: CreateFactoryConfigType;
}

const props = defineProps<CoreProps>();

defineOptions({
    name: "BeastForm",
})

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, any>],
    "changeField": [value: any, field: string],
    "update:api": [api: ApiType],
    "mounted": [],
    'unmounted': [],
}>()

const vm = getCurrentInstance();

const api = new apiFactory(vm);

const curValue = ref({})

if (!globalCache?.config) {
    new LoaderFactory(vm)
}
if (props.config?.framework) {
    globalCache.config.switchFramework(props.config.framework);
}

const coreProps = ref({});

const coreComp = computed(() => {
    if (props.option?.isForm !== false && globalCache.config.baseConfig.form) {
        if (globalCache.config.baseConfig.formPropsModel) {
            coreProps.value[globalCache.config.baseConfig.formPropsModel] = curValue.value
        }
        if (props.option?.form) {
            for (let key in props.option.form) {
                coreProps.value[key] = props.option.form[key];
            }
        }

        return LoaderFactory.getComponents(globalCache.config.baseConfig.form)
    } else {
        return h('div')
    }

})

const emitChangeField = (value: any, field: string) => {
    curValue.value[field] = value;
    console.log(curValue.value)
    emit('update:modelValue', { ...curValue.value })
    emit("changeField", value, field)
}

onMounted(() => {
    emit("mounted");
    emit("update:api", api.publishApi())
})

onUnmounted(() => {
    emit("unmounted");
})

defineExpose({
})
</script>