<template>
    <component :is="curComp && curOption.isForm !== false? curComp: divComp" v-bind="curProps">
        <template v-for="item in rule">
            <FormItemComp :rule="item" :modelValue="modelValue" :api="api" :isI18n="curOption.isI18n" :disabled="disabled"
                @changeField="emitChangeField" />
        </template>
    </component>
</template>
<script setup lang="ts">
import { defineOptions, getCurrentInstance, onMounted, onUnmounted, h, reactive, onBeforeUnmount, inject, provide, watch } from 'vue'
import { RuleType, PropsOptionType, ApiType } from '../types'
import { LoaderFactory, globalCache } from './loader';
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
}

defineOptions({
    name: beastName.BASE,
})

const props = defineProps<CoreProps>();
const emit = defineEmits(["update:modelValue", "changeField", "update:api", "mounted", 'unmounted'])

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

const curOption = reactive<PropsOptionType>({
    ...globalCache.basePropsOption,
    ...baseVm?.props?.option,
    ...props.option
});

if (curOption.framework) {
    globalCache.config.switchFramework(curOption.framework);
}

const divComp = h('div');
const curProps = reactive<Record<string, any>>({ ...curOption.form });
const curComp = globalCache.config.baseConfig.form ? LoaderFactory.getComponents(globalCache.config.baseConfig.form) : null

if (curComp && globalCache.config.baseConfig.formPropsModel) {
    curProps[globalCache.config.baseConfig.formPropsModel] = props.modelValue
}

watch(() => props.option, (o) => {
    if (o.isForm !== curOption.isForm) {
        curOption.isForm = o.isForm
    }
}, { deep: true })

// watch(() => props.modelValue, () => {
// }, { deep: true })

const getFormData = (field?: string) => {
    if (field) {
        return props.modelValue[field];
    } else {
        return { ...props.modelValue };
    }
}

const resetFormData = (field?: string) => {
    if (field) {
        publishApi.setValue(field, null)
    } else {
        Object.keys({ ...props.modelValue }).forEach(key => {
            resetFormData(key);
        })
    }
}

const validate = async (field?: string) => {
    let valid = true;
    if (curComp && props.option?.isForm !== false) {
        const validateName = globalCache.config.baseConfig.formEventValidate;
        if (validateName && vm.subTree?.component?.exposed?.[validateName]) {
            try {
                valid = await vm.subTree?.component?.exposed?.[validateName](field);
            } catch (error) {
                valid = false;
            }
        }

        if (!field) {
            Object.keys({ ...props.modelValue }).forEach(async key => {
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
    if (curComp && props.option?.isForm !== false) {
        const clearValidateName = globalCache.config.baseConfig.formEventClearValidate;
        if (clearValidateName && vm.subTree?.component?.exposed?.[clearValidateName]) {
            vm.subTree?.component?.exposed?.[clearValidateName](field);
        }
        if (!field) {
            Object.keys({ ...props.modelValue }).forEach(key => {
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
    const modelValue = { ...props.modelValue };
    modelValue[field] = value;
    emit('update:modelValue', modelValue)
    emit("changeField", value, field)
}

onMounted(() => {
    if (props.name) {
        LoaderFactory.cacheApi(props.name, publishApi);
    }
    emit("mounted");
    emit("update:api", publishApi)
})

onBeforeUnmount(() => {
    if (props.name) {
        LoaderFactory.removeCacheApi(props.name);
    }
})

onUnmounted(() => {
    emit("unmounted");
})

</script>