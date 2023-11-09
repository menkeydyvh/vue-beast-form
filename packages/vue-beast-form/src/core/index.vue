<template>
    <component :is="curComp && option?.isForm !== false? curComp: divComp" v-bind="curProps">
        <template v-for="item in rule">
            <FormItemComp :rule="item" :modelValue="modelValue" :api="api" @changeField="emitChangeField" />
        </template>
    </component>
</template>
<script setup lang="ts">
import { defineOptions, getCurrentInstance, onMounted, onUnmounted, h, reactive, onBeforeUnmount, inject, provide, watch, nextTick } from 'vue'
import { RuleType, PropsOptionType, ApiType } from '../types'
import { LoaderFactory, globalCache } from './loader';
import { CreateFactoryConfigType } from '../factory';
import FormItemComp from './formItem.vue';
import apiFactory from './api';
import { beastName } from '../tool';

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
    name: beastName.BASE,
})

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, any>],
    "changeField": [value: any, field: string],
    "update:api": [api: ApiType],
    "mounted": [],
    'unmounted': [],
}>()

const baseVm = inject('baseVm', null);
const vm = getCurrentInstance();
if (!baseVm) {
    provide('baseVm', vm)
}

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

const curValue = reactive<Record<string, any>>({ ...modelValue });
const curProps = reactive<Record<string, any>>({});

const divComp = h('div');

const curComp = globalCache.config.baseConfig.form ?
    h(LoaderFactory.getComponents(globalCache.config.baseConfig.form)) : null

// watch好像监听不了值变化不知道什么原因只能用vm下的$watch
vm.proxy.$watch("option", (value) => {
    const formProps: Record<string, any> = {
        ...baseVm?.props?.option?.form,
        ...value?.form,
    };
    for (let key in formProps) {
        curProps[key] = formProps[key];
    }
}, { immediate: true, deep: true })

vm.proxy.$watch("modelValue", () => {
    if (coreConfig.formModel) {
        curProps[coreConfig.formModel] = curValue
    }
}, { immediate: true, deep: true })

vm.proxy.$watch("disabled", (value) => {
    Object.keys(curValue).forEach(field => {
        publishApi.setDisabled(field, value)
    })
}, { immediate: true })

const getFormData = (field?: string) => {
    if (field) {
        return curValue[field];
    } else {
        return { ...curValue };
    }
}

const resetFormData = (field?: string) => {
    if (field) {
        publishApi.setValue(field, null)
    } else {
        Object.keys(curValue).forEach(key => {
            resetFormData(key);
        })
    }
}

const validate = async (field?: string) => {
    let valid = true;
    if (curComp && option?.isForm !== false) {
        const validateName = globalCache.config.baseConfig.formEventValidate;
        if (validateName && vm.subTree?.component?.exposed?.[validateName]) {
            try {
                valid = await vm.subTree?.component?.exposed?.[validateName](field);
            } catch (error) {
                valid = false;
            }
        }

        if (!field) {
            Object.keys(curValue).forEach(async key => {
                const rf = api.getRule(key);
                if (rf.subTree?.type?.['name'] === beastName.BASE) {
                    if (!await rf.subTree.component.exposed.validate()) {
                        valid = false;
                    }
                }
            })
        }
    }
    return valid;
}

const clearFormValidate = (field?: string) => {
    if (curComp && option?.isForm !== false) {
        const clearValidateName = globalCache.config.baseConfig.formEventClearValidate;
        if (clearValidateName && vm.subTree?.component?.exposed?.[clearValidateName]) {
            vm.subTree?.component?.exposed?.[clearValidateName](field);
        }
        if (!field) {
            Object.keys(curValue).forEach(key => {
                const rf = api.getRule(key);
                if (rf.subTree?.type?.['name'] === beastName.BASE) {
                    rf.subTree.component.exposed.clearFormValidate()
                }
            })
        }
    }
}

defineExpose({
    getFormData,
    resetFormData,
    validate,
    clearFormValidate,
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

</script>