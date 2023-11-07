<template>
    <template v-if="display">
        <component v-if="curComp && rule.field" :is="curComp" v-bind="curProps">
            <template v-if="titleSlot" #[titleSlot]>
                <template v-if="typeof rule.title === 'string'">
                    {{ rule.title }}
                </template>
                <BeastRule v-else-if="(typeof rule.title === 'object')" :rule="rule.title" :modelValue="modelValue"
                    :api="api" @changeField="emitChangeField" />
            </template>
            <BeastRule :rule="rule" :modelValue="modelValue" :api="api" @changeField="emitChangeField" />
        </component>
        <BeastRule v-else :rule="rule" :modelValue="modelValue" :api="api" @changeField="emitChangeField" />
    </template>
</template>
<script setup lang="ts">
import { computed, ref, watch, mergeProps, getCurrentInstance } from 'vue'
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

const props = defineProps<RuleProps>();

const emit = defineEmits<{
    'changeField': [value: any, field: string];
}>();

const titleSlot = ref<string>();

const display = ref(props.rule?.display ?? true);

watch(() => props.rule.display, (v) => {
    display.value = v;
})

const vm = getCurrentInstance();

const curProps = ref<Record<string, any>>({});

const curComp = computed(() => {
    const field = props.rule.field;
    if (field) {
        props.api.addfieldVms(`formItem-${field}`, vm);
    }
    if (globalCache.config.baseConfig.formItem) {
        if (globalCache.config.baseConfig.formItemPropName && props.rule.field) {
            curProps.value[globalCache.config.baseConfig.formItemPropName] = props.rule.field
        }

        if (['string', 'object'].includes(typeof props.rule.title)) {
            titleSlot.value = globalCache.config.baseConfig.formItemSlotTitle
        }


        curProps.value = mergeProps(props.rule.attrs, {
            style: props.rule.style,
            class: props.rule.class,
        })

        return LoaderFactory.getComponents(globalCache.config.baseConfig.formItem)
    }
});

const emitChangeField = (value: any, field: string) => {
    emit("changeField", value, field)
}

const setProps = (key: string, value: any) => {
    curProps.value[key] = value;
}

const setDisplay = (value: boolean) => {
    display.value = value
}

defineExpose({
    setProps,
    setDisplay,
})
</script>