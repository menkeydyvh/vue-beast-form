<template>
    <component :is="curComp && option?.isForm !== false? curComp: divComp" v-bind="curProps">
        <template v-for="item in rule">
            <FormItemComp :rule="item" :modelValue="modelValue" :api="api" @changeField="emitChangeField" />
        </template>
    </component>
</template>
<script setup lang="ts">
import { defineOptions, getCurrentInstance, onMounted, onUnmounted, ref, h, VNode, reactive, watch, onBeforeUnmount } from 'vue'
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

const { name, option, modelValue, config } = defineProps<CoreProps>();

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
const publishApi = api.publishApi();

if (!globalCache?.config) {
    new LoaderFactory(vm);
}
if (config?.framework) {
    globalCache.config.switchFramework(config.framework);
}

const coreConfig = {
    formModel: globalCache.config.baseConfig.formPropsModel ?? '',
};

const curValue = reactive<Record<string, any>>({});
const curProps = reactive<Record<string, any>>({});

const divComp = h('div');

const curComp = globalCache.config.baseConfig.form ?
    h(LoaderFactory.getComponents(globalCache.config.baseConfig.form)) : null

vm.proxy.$watch("option", (value) => {
    if (value?.form) {
        for (let key in value.form) {
            curProps[key] = value.form[key];
        }
    }
}, { immediate: true, deep: true })

vm.proxy.$watch("modelValue", () => {
    // todo:考虑外部设置值时候的处理目前先不考虑
    // if (props.modelValue) {
    //     for (let key in props.modelValue) {
    //         if (coreValue[key] !== props.modelValue[key]) {
    //             publishApi.setValue(key, props.modelValue[key])
    //         }
    //     }
    // }
    if (coreConfig.formModel) {
        curProps[coreConfig.formModel] = curValue
    }
}, { immediate: true, deep: true })

vm.proxy.$watch("disabled", (value) => {
    Object.keys(curValue).forEach(field => {
        publishApi.setDisabled(field, value)
    })
})

const emitChangeField = (value: any, field: string) => {
    curValue[field] = value;
    emit('update:modelValue', { ...curValue })
    emit("changeField", value, field)
}

onMounted(() => {
    if (name) {
        LoaderFactory.cacheApi(name, publishApi);
    }
    emit("mounted");
    emit("update:api", publishApi)
})

onBeforeUnmount(() => {
    if (name) {
        LoaderFactory.removeCacheApi(name);
    }
})

onUnmounted(() => {
    emit("unmounted");
})

defineExpose({
})
</script>