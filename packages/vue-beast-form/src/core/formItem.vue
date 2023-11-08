<template>
    <template v-if="display">
        <component v-if="curComp && rule.field" :is="curComp" v-bind="curProps">
            <template v-if="titleSlot" #[titleSlot]>
                <template v-if="typeof rule.title === 'string'">
                    {{ rule.title }}
                </template>
                <BeastRule v-else-if="(typeof rule.title === 'object')" :rule="rule.title" :modelValue="modelValue"
                    :api="api" :isI18n="isI18n" @changeField="emitChangeField" />
            </template>
            <BeastRule :rule="rule" :modelValue="modelValue" :api="api" :isI18n="isI18n" @changeField="emitChangeField" />
        </component>
        <BeastRule v-else :rule="rule" :modelValue="modelValue" :api="api" :isI18n="isI18n"
            @changeField="emitChangeField" />
    </template>
</template>
<script setup lang="ts">
import { ref, reactive, mergeProps, getCurrentInstance, h } from 'vue'
import { RuleType } from '../types';
import { LoaderFactory, globalCache } from './loader';
import BeastRule from './rule.vue';
import apiFactory from './api';


interface RuleProps {
    rule: RuleType;
    api: apiFactory;
    modelValue?: Record<string, any>;
    isI18n?: boolean;
}

const { rule, api } = defineProps<RuleProps>();

const emit = defineEmits<{
    'changeField': [value: any, field: string];
}>();

const titleSlot = ref<string>();

const display = ref(rule?.display ?? true);

const vm = getCurrentInstance();

const curConfig = {
    field: rule.field,
}

if (curConfig.field) {
    api.addfieldVms(`formItem-${curConfig.field}`, vm);
}

const curProps = reactive<Record<string, any>>({});

const curComp = globalCache.config.baseConfig.formItem ?
    h(LoaderFactory.getComponents(globalCache.config.baseConfig.formItem)) : null;


const emitChangeField = (value: any, field: string) => {
    emit("changeField", value, field);
}

const setProps = (key: string, value: any) => {
    curProps[key] = value;
}

const setDisplay = (value: boolean) => {
    display.value = value;
}

if (globalCache.config.baseConfig.formItem) {
    if (globalCache.config.baseConfig.formItemPropName && curConfig.field) {
        curProps[globalCache.config.baseConfig.formItemPropName] = curConfig.field;
    }

    if (['string', 'object'].includes(typeof rule.title)) {
        titleSlot.value = globalCache.config.baseConfig.formItemSlotTitle;
    }

    const mp = mergeProps(rule.attrs, {
        style: rule.style,
        class: rule.class,
    })

    for (let key in mp) {
        curProps[key] = mp[key];
    }
}

defineExpose({
    setProps,
    setDisplay,
})
</script>