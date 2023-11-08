<template>
    {{ curProps }}
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
import { reactive, mergeProps, h, getCurrentInstance, watch } from 'vue'
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

const { rule, api, modelValue, isI18n } = defineProps<RuleProps>();

const curConfig = reactive({
    field: rule.field,
    disabled: '',
    modelKeys: [],
    modelKeyEvents: [],
    modelKeyDefaultValues: [],
});

const emit = defineEmits<{
    'changeField': [value: any, field: string];
}>();

const curProps = reactive<Record<string, any>>({});

const vm = getCurrentInstance();

const typeofComp = typeof LoaderFactory.getComponents(rule.type);

const curComp = h(LoaderFactory.getComponents(rule.type));

const onChangeField = (value: any, field: string) => {
    emit("changeField", value, field)
}

const emitChangeField = () => {
    if (curConfig.field) {
        emit("changeField", getValue(), curConfig.field)
    }
}

const getValue = (key?: string) => {
    if (curConfig.modelKeys?.length) {
        if (curConfig.modelKeys.length === 1) {
            return curProps[curConfig.modelKeys[0]]
        } else {
            if (key) {
                return curProps[key]
            } else {
                const value = {};
                curConfig.modelKeys.forEach(key => {
                    value[key] = curProps[key]
                })
                return value;
            }
        }
    }
    return undefined;
}

const setValue = (v: any, key?: string) => {
    if (curConfig?.modelKeys?.length) {
        if (curConfig.modelKeys.length === 1) {
            curProps[curConfig.modelKeys[0]] = v;
            emitChangeField();
        } else {
            if (key) {
                curProps[key] = v;
                emitChangeField();
            } else {
                console.error('多个v-model必须指定第二个参数')
            }
        }
    }
}

const setProps = (key: string, value: any) => {
    curProps[key] = value;
}

const setDisabled = (value: boolean) => {
    if (curConfig.disabled) {
        setProps(curConfig.disabled, value);
    }
}

const setI18n = (str: string) => {
    if (isI18n && globalCache.t) {
        return globalCache.t(str) as string;
    }
    return str;
}

const addOn = (event: string, callback?: Function) => {
    curProps[onToPropsName(event)] = function () {
        if (callback) {
            callback(...arguments, api.publishApi());
        } else {
            rule.on?.[event]?.(...arguments, api.publishApi());
        }
    }
}

const addEmit = (eType: EmitType) => {
    curProps[onToPropsName(eType.event)] = function () {
        vm.emit(eType.alias, ...arguments, api.publishApi());
    }
}

const delOnOrEmit = (event: string) => {
    const propsEventName = onToPropsName(event);
    if (typeof curProps[propsEventName] === 'function') {
        delete curProps[propsEventName];
    }
}

const initValue = () => {
    if (curConfig?.modelKeys?.length) {
        let value: any;
        if (curConfig.modelKeys.length === 1) {
            const key = curConfig.modelKeys[0], keyEvent = curConfig.modelKeyEvents[0];
            if (modelValue && curConfig.field in modelValue) {
                value = modelValue[curConfig.field];
            } else if ('value' in rule) {
                value = rule.value;
            } else if (rule.props && key in rule.props) {
                value = rule.props[key];
            } else {
                value = curConfig.modelKeyDefaultValues[0];
            }
            curProps[key] = value;

            curProps[keyEvent] = function () {
                setValue(arguments[0], key);
            }

            emitChangeField();
        } else {
            value = {};
            curConfig.modelKeys.forEach((key, index) => {
                if (modelValue && curConfig.field in modelValue) {
                    value[key] = modelValue[curConfig.field]?.[key];
                } else if ('value' in rule) {
                    value[key] = rule.value?.[key];
                } else if (rule.props && key in rule.props) {
                    value[key] = rule.props[key];
                } else {
                    value[key] = curConfig.modelKeyDefaultValues[index];
                }
                curProps[key] = value[key];


                let keyEvent = curConfig.modelKeyEvents[index]
                curProps[keyEvent] = function () {
                    setValue(arguments[0], key);
                }
            })

            emitChangeField();
        }
    }
}

if (curConfig.field) {
    api.addfieldVms(curConfig.field, vm);
}

if (typeofComp === 'string') {
    // init props
    const mp = mergeProps(
        rule.attrs,
        {
            style: rule.style,
            class: rule.class,
        }
    )
    for (let key in mp) {
        curProps[key] = mp[key];
    }
} else {
    // init props
    let mp: Record<string, any> = {};
    if (globalCache.config.baseConfig.formItem && rule.title !== false) {
        mp = mergeProps(rule.props)
    } else {
        mp = mergeProps(
            rule.props,
            rule.attrs,
            {
                style: rule.style,
                class: rule.class,
            }
        )
    }
    for (let key in mp) {
        curProps[key] = mp[key];
    }

    // init config
    const curCompPropsKeys = curComp.type['props'] ? Object.keys(curComp.type['props']) : null,
        curCompName = curComp.type['name'];
    curConfig.disabled = globalCache.config.getComponentDisabled(curCompName);
    if (curConfig.disabled) {
        curProps[curConfig.disabled] = false;
    }
    if (rule.model?.length) {
        curConfig.modelKeys = rule.model.filter(key => curCompPropsKeys.includes(key));
    } else {
        curConfig.modelKeys = globalCache.config.getModelValueKeys(curCompName).filter(key => curCompPropsKeys.includes(key));
    }

    if (curConfig.modelKeys.length) {
        curConfig.modelKeyEvents = globalCache.config.getModelValueChangeEvents(curCompName, curConfig.modelKeys);
        if (rule.defaultValue?.length) {
            curConfig.modelKeyDefaultValues = rule.defaultValue;
        } else {
            curConfig.modelKeyDefaultValues = globalCache.config.getModelValueDefaultNullValues(curCompName, curConfig.modelKeys);
        }

        if (curConfig.field) {
            initValue();
        }
    }
}

rule.emits?.forEach(item => {
    addEmit(item);
})
if (rule.on) {
    for (let onName in rule.on) {
        addOn(onName);
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