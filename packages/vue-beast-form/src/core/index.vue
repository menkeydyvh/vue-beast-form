<template>
    <component ref="formRef" :is="curComp && curOption.isForm !== false? curComp: divComp" v-bind="curProps">
        <template v-for="item in rule">
            <FormItemComp :rule="item" :modelValue="modelValue" :api="api" :isI18n="curOption.isI18n" :disabled="disabled"
                @changeField="emitChangeField" />
        </template>
    </component>
</template>
<script setup lang="ts">
import { defineOptions, getCurrentInstance, ref, onMounted, onUnmounted, h, reactive, onBeforeUnmount, inject, provide, watch, computed, ComponentInternalInstance } from 'vue'
import { RuleType, PropsOptionType, ApiType } from '../types'
import { LoaderFactory, globalCache } from './loader';
import FormItemComp from './item.vue';
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

const formRef = ref();
const props = defineProps<CoreProps>();
const emit = defineEmits(["update:modelValue", "changeField", "update:api", "mounted", 'unmounted'])

const baseVm = inject('baseVm', null);
const beastFormVms = inject('beastFormVms', []);
const vm = getCurrentInstance();
if (!baseVm) {
    provide('baseVm', vm)
    provide('beastFormVms', beastFormVms)
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
const curValue = ref({ ...props.modelValue })
const curProps = reactive<Record<string, any>>({ ...curOption.form });
const curComp = globalCache.config.baseConfig.form ? LoaderFactory.getComponents(globalCache.config.baseConfig.form) : null

if (curComp && globalCache.config.baseConfig.formPropsModel) {
    curProps[globalCache.config.baseConfig.formPropsModel] = curValue.value
}

watch(() => props.option, (o) => {
    if (o.isForm !== curOption.isForm) {
        curOption.isForm = o.isForm
    }
}, { deep: true })

const getFormData = (field?: string) => {
    if (field) {
        return curValue.value[field];
    } else {
        return { ...curValue.value };
    }
}

const resetFormData = (field?: string) => {
    if (field) {
        publishApi.setValue(field, null)
    } else {
        Object.keys(curValue.value).forEach(key => {
            resetFormData(key);
        })
    }
}

const validate = async (field?: string) => {
    let valid = true;
    const validateName = globalCache.config.baseConfig.formEventValidate;
    if (formRef.value && validateName in formRef.value) {
        try {
            if (!await formRef.value[validateName](field)) {
                valid = false;
            }
        } catch (error) {
            valid = false;
        }

        if (!field) {
            for (let i in beastFormVms) {
                if (beastFormVms[i].uid != vm.uid && beastFormVms[i].refs?.formRef?.[validateName]) {
                    try {
                        if (! await beastFormVms[i].refs.formRef[validateName]()) {
                            valid = false;
                        }
                    } catch (error) {
                        valid = false;
                    }
                }
            }

        }
    }
    return valid;
}

const clearFormValidate = (field?: string) => {
    const clearValidateName = globalCache.config.baseConfig.formEventClearValidate;
    if (formRef.value && clearValidateName in formRef.value) {
        formRef.value[clearValidateName](field);
        if (!field) {
            beastFormVms.forEach(item => {
                if (item.uid != vm.uid && item.refs?.formRef?.[clearValidateName]) {
                    item.refs.formRef[clearValidateName]();
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
    curValue.value[field] = value
    emit('update:modelValue', { ...curValue.value })
    emit("changeField", value, field)
}

onMounted(() => {
    beastFormVms.push(vm);
    if (props.name) {
        LoaderFactory.cacheApi(props.name, publishApi);
    }
    emit("mounted");
    emit("update:api", publishApi)
})

onBeforeUnmount(() => {
    const idx = beastFormVms.findIndex(item => item.uid === vm.uid);
    if (idx > -1) {
        beastFormVms.splice(idx, 1);
    }
    if (props.name) {
        LoaderFactory.removeCacheApi(props.name);
    }
})

onUnmounted(() => {
    emit("unmounted");
})

</script>