<template>
    <component :is="curComp" v-bind="curProps">
        <template v-if="rule.children">
            <template v-if="Array.isArray(rule.children)">
                <template v-for="child in rule.children">
                    <template v-if="typeof child === 'string'">
                        {{ child }}
                    </template>
                    <template v-else>
                        <BeastRule :rule="child" :api="api" :modelValue="modelValue" @changeField="onChangeField" />
                    </template>
                </template>
            </template>
            <template v-else>
                <template v-for="(child, key) in rule.children">
                    <Transition>
                        <template #[key]>
                            <template v-if="typeof child === 'string'">
                                {{ child }}
                            </template>
                            <template v-else>
                                <BeastRule :rule="child" :api="api" :modelValue="modelValue" @changeField="onChangeField" />
                            </template>
                        </template>
                    </Transition>
                </template>
            </template>
        </template>
    </component>
</template>
<script setup lang="ts">
import { computed, ref, mergeProps, h, getCurrentInstance } from 'vue'
import { EmitType, RuleType } from '../types';
import { LoaderFactory, globalCache } from './loader';
import BeastRule from './rule.vue';
import apiFactory from './api';
import { onToPropsName } from '../tool';

interface RuleProps {
    rule: RuleType;
    api: apiFactory;
    modelValue?: Record<string, any>;
    isI18n?: boolean;
}

const props = defineProps<RuleProps>();

const curConfig = ref<{
    isInit?: boolean;
    disabled?: string;
    modelKeys?: string[];
    modelKeyEvents?: string[];
    modelKeyDefaultValues?: any[];
}>({});

const emit = defineEmits<{
    'changeField': [value: any, field: string];
}>();

const curProps = ref<Record<string, any>>({});

const vm = getCurrentInstance();

const curComp = computed(() => {
    const comp = LoaderFactory.getComponents(props.rule.type),
        field = props.rule?.field;
    if (field) {
        props.api.addfieldVms(field, vm);
    }
    if (typeof comp === 'string') {
        curProps.value = mergeProps(
            props.rule.attrs,
            {
                style: props.rule.style,
                class: props.rule.class,
            }
        )
        initRuleListen();
        return h(comp);
    } else {
        // init props
        if (globalCache.config.baseConfig.formItem && props.rule.title !== false) {
            curProps.value = mergeProps(props.rule.props)
        } else {
            curProps.value = mergeProps(
                props.rule.props,
                props.rule.attrs,
                {
                    style: props.rule.style,
                    class: props.rule.class,
                }
            )
        }

        // init config
        const propsKeys = comp?.props ? Object.keys(comp.props) : null;
        curConfig.value.disabled = globalCache.config.getComponentDisabled(comp.name);

        if (props.rule.model?.length) {
            curConfig.value.modelKeys = props.rule.model.filter(key => propsKeys.includes(key));
        } else {
            curConfig.value.modelKeys = globalCache.config.getModelValueKeys(comp.name).filter(key => propsKeys.includes(key));;
        }

        if (curConfig.value.modelKeys.length) {
            curConfig.value.modelKeyEvents = globalCache.config.getModelValueChangeEvents(comp.name, curConfig.value.modelKeys);
            if (props.rule.defaultValue?.length) {
                curConfig.value.modelKeyDefaultValues = props.rule.defaultValue;
            } else {
                curConfig.value.modelKeyDefaultValues = globalCache.config.getModelValueDefaultNullValues(comp.name, curConfig.value.modelKeys);
            }

            //init value
            if (field) {
                initValue(field)
            }
        }
        initRuleListen();
        return comp;
    }
});


const initValue = (field: string) => {
    if (Array.isArray(curConfig.value?.modelKeys)) {
        let value: any;
        if (curConfig.value.modelKeys.length === 1) {
            let key = curConfig.value.modelKeys[0], keyEvent = curConfig.value.modelKeyEvents[0];
            if (props.modelValue && field in props.modelValue) {
                value = props.modelValue[field];
            } else if ('value' in props.rule) {
                value = props.rule.value;
            } else if (props.rule?.props && key in props.rule.props) {
                value = props.rule.props[key];
            } else {
                value = curConfig.value.modelKeyDefaultValues[0];
            }
            curProps.value[key] = value;

            curProps.value[keyEvent] = function () {
                setValue(arguments[0], key)
            }

            emitChangeField()
        } else {
            value = {};
            curConfig.value.modelKeys.forEach((key, index) => {
                if (props.modelValue && field in props.modelValue) {
                    value[key] = props.modelValue[field]?.[key];
                } else if ('value' in props.rule) {
                    value[key] = props.rule.value?.[key];
                } else if (props.rule?.props && key in props.rule.props) {
                    value[key] = props.rule.props[key];
                } else {
                    value[key] = curConfig.value.modelKeyDefaultValues[index];
                }
                curProps.value[key] = value[key];


                let keyEvent = curConfig.value.modelKeyEvents[index]
                curProps.value[keyEvent] = function () {
                    setValue(arguments[0], key)
                }
            })

            emitChangeField()
        }
    }
}

const initRuleListen = () => {
    props.rule?.emits?.forEach(item => {
        addEmit(item);
    })
    if (props.rule?.on) {
        for (let onName in props.rule.on) {
            addOn(onName);
        }
    }
}

const onChangeField = (value: any, field: string) => {
    emit("changeField", value, field)
}

const emitChangeField = () => {
    const field = props.rule?.field;
    if (field) {
        emit("changeField", getValue(), field)
    }
}

// api
const getValue = (key?: string) => {
    if (curConfig.value?.modelKeys?.length) {
        if (curConfig.value.modelKeys.length === 1) {
            return curProps.value[curConfig.value.modelKeys[0]]
        } else {
            if (key) {
                return curProps.value[key]
            } else {
                const value = {};
                curConfig.value.modelKeys.forEach(key => {
                    value[key] = curProps.value[key]
                })
                return value;
            }
        }
    }
    return undefined;
}

const setValue = (v: any, key?: string) => {
    if (curConfig.value?.modelKeys?.length) {
        if (curConfig.value.modelKeys.length === 1) {
            curProps.value[curConfig.value.modelKeys[0]] = v;
            emitChangeField()
        } else {
            if (key) {
                curProps.value[key] = v;
                emitChangeField()
            } else {
                console.error('多个v-model必须指定第二个参数')
            }
        }
    }
}

const setProps = (key: string, value: any) => {
    curProps.value[key] = value;
}

const setDisabled = (value: boolean) => {
    if (curConfig.value.disabled) {
        setProps(curConfig.value.disabled, value);
    }
}

const setI18n = (str: string) => {
    if (props.isI18n && globalCache.t) {
        return globalCache.t(str) as string;
    }
    return str;
}

const addOn = (event: string, callback?: Function) => {
    curProps.value[onToPropsName(event)] = function () {
        if (callback) {
            callback(...arguments, props.api.publishApi())
        } else {
            props.rule?.on?.[event]?.(...arguments, props.api.publishApi())
        }
    }
}

const addEmit = (eType: EmitType) => {
    curProps.value[onToPropsName(eType.event)] = function () {
        vm.emit(eType.alias, ...arguments, props.api.publishApi())
    }
}

const delOnOrEmit = (event: string) => {
    const propsEventName = onToPropsName(event)
    if (typeof curProps.value?.[propsEventName] === 'function') {
        delete curProps.value[propsEventName]
    }
}

defineExpose({
    getValue,
    setValue,
    setProps,
    setI18n,
    addOn,
    addEmit,
    delOnOrEmit,
    setDisabled,
})

</script>