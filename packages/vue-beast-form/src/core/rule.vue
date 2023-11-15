<template>
    <component :is="curComp" v-bind="curProps" />
</template>
<script setup lang="ts">
import { reactive, mergeProps, h, getCurrentInstance, resolveDirective, withDirectives, Directive, DirectiveArguments, watch, computed, VNode, ref } from 'vue'
import { EmitType, RuleChlidren, RuleType } from '../types';
import { LoaderFactory, globalCache } from './loader';
import BeastRule from './rule.vue';
import apiFactory from './api';
import { beastName, onToPropsName } from '../tool';

defineOptions({
    name: beastName.BASERULE,
})
interface RuleProps {
    rule: RuleType;
    api: apiFactory;
    modelValue?: any;
    isI18n?: boolean;
    disabled?: boolean;
}

const props = defineProps<RuleProps>();

const curConfig = reactive({
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
const publishApi = props.api.publishApi();
const typeofComp = typeof LoaderFactory.getComponents(props.rule.type);

const onChangeField = (value: any, field: string) => {
    emit("changeField", value, field)
}

const emitChangeField = () => {
    if (props.rule.field) {
        emit("changeField", getValue(), props.rule.field)
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

watch(() => props.disabled, () => {
    setDisabled(props.disabled)
})

const setI18n = (str: string) => {
    if (props.isI18n && globalCache.t) {
        return globalCache.t(str) as string;
    }
    return str;
}

const addOn = (event: string, callback?: Function) => {
    curProps[onToPropsName(event)] = function () {
        if (callback) {
            callback(...arguments, publishApi);
        } else {
            props.rule.on?.[event]?.(...arguments, publishApi);
        }
    }
}

// const addEmit = (eType: EmitType) => {
// curProps[onToPropsName(eType.event)] = function () {
//     vm.emit(eType.alias, ...arguments, publishApi);
// }
// }

const delOn = (event: string) => {
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
            if (props.modelValue != undefined) {
                value = props.modelValue;
            } else if ('value' in props.rule) {
                value = props.rule.value;
            } else if (props.rule.props && key in props.rule.props) {
                value = props.rule.props[key];
            } else {
                value = curConfig.modelKeyDefaultValues[0];
            }
            curProps[key] = value;

            curProps[keyEvent] = (value: any) => {
                setValue(value, key)
            }

            emitChangeField();
        } else {
            value = {};
            curConfig.modelKeys.forEach((key, index) => {
                if (props.modelValue && props.rule.field in props.modelValue) {
                    value[key] = props.modelValue[props.rule.field]?.[key];
                } else if ('value' in props.rule) {
                    value[key] = props.rule.value?.[key];
                } else if (props.rule.props && key in props.rule.props) {
                    value[key] = props.rule.props[key];
                } else {
                    value[key] = curConfig.modelKeyDefaultValues[index];
                }

                const keyEvent = curConfig.modelKeyEvents[index]
                curProps[keyEvent] = (value: any) => {
                    setValue(value, key)
                }

                curProps[key] = value[key];
            })

            emitChangeField();
        }
    }
}

/**
 * 不在支持指令 
 * 指令无法动态加载只能解析全局指令因此不打算支持
 */
// const directives: DirectiveArguments = [];
// props.rule.directives?.forEach(item => {
//     if (Array.isArray(item)) {
//         if (typeof item[0] === 'string') {
//             const rd = resolveDirective(item[0]);
//             if (rd) {
//                 directives.push([rd, ...item.slice(1)] as DirectiveArguments[0])
//             }
//         } else {
//             directives.push([{ ...item[0] }, ...item.slice(1)] as DirectiveArguments[0])
//         }
//     }
// });
// const curComp = withDirectives(h(LoaderFactory.getComponents(props.rule.type)), directives) ;

const renderRuleChlidren = (child: RuleChlidren) => {
    if (typeof child === 'string') {
        return setI18n(child);
    } else {
        return h(BeastRule, {
            rule: child,
            api: props.api,
            modelValue: props.modelValue?.[child.field],
            disabled: props.disabled,
            onChangeField: onChangeField,
        });
    }
}

const slots = ref<Record<string, () => (VNode | string)[]>>({});

if (props.rule.children) {
    if (Array.isArray(props.rule.children)) {
        const slotObj: Record<string, RuleChlidren[]> = {
            default: []
        };
        props.rule.children.forEach(child => {
            if (typeof child === 'string') {
                slotObj.default.push(child);
            } else {
                if (child.slot) {
                    if (!slotObj[child.slot]) {
                        slotObj[child.slot] = []
                    }
                    slotObj[child.slot].push(child);
                } else {
                    slotObj.default.push(child);
                }
            }
        });
        for (let key in slotObj) {
            slots.value[key] = () => slotObj[key].map(item => renderRuleChlidren(item))
        }
    } else {
        const childObj = props.rule.children;
        for (let key in childObj) {
            const child = childObj[key];
            slots.value[key] = function () {
                if (typeof child === 'function') {
                    const childFn = child(...arguments);
                    if (Array.isArray(childFn)) {
                        return childFn.map(item => renderRuleChlidren(item))
                    } else {
                        return [renderRuleChlidren(childFn)];
                    }
                } else {
                    return [renderRuleChlidren(child)]
                }
            }
        }
    }
}

const curComp = h(LoaderFactory.getComponents(props.rule.type), {}, Object.keys(slots.value).length ? slots.value : undefined);

if (props.rule.field) {
    props.api.addfieldVms(props.rule.field, vm);
}

if (typeofComp === 'string') {
    // init props
    const mp = mergeProps(
        props.rule.attrs,
        {
            style: props.rule.style,
            class: props.rule.class,
        }
    )
    for (let key in mp) {
        curProps[key] = mp[key];
    }
} else {
    // init props
    let mp: Record<string, any> = {};
    if (globalCache.config.baseConfig.formItem && props.rule.title !== false) {
        mp = mergeProps(props.rule.props)
    } else {
        mp = mergeProps(
            props.rule.props,
            props.rule.attrs,
            {
                style: props.rule.style,
                class: props.rule.class,
            }
        )
    }
    for (let key in mp) {
        curProps[key] = mp[key];
    }

    // init config
    const curCompPropsKeys = Object.keys({ ...curComp.type['props'] }),
        curCompName = curComp.type['name'];
    curConfig.disabled = globalCache.config.getComponentDisabled(curCompName);

    if (props.rule.model?.length) {
        curConfig.modelKeys = props.rule.model.filter(key => curCompPropsKeys.includes(key));
    } else {
        curConfig.modelKeys = globalCache.config.getModelValueKeys(curCompName).filter(key => curCompPropsKeys.includes(key));
    }

    if (curConfig.modelKeys.length) {
        curConfig.modelKeyEvents = globalCache.config.getModelValueChangeEvents(curCompName, curConfig.modelKeys);
        if (props.rule.defaultValue?.length) {
            curConfig.modelKeyDefaultValues = props.rule.defaultValue;
        } else {
            curConfig.modelKeyDefaultValues = globalCache.config.getModelValueDefaultNullValues(curCompName, curConfig.modelKeys);
        }

        if (props.rule.field) {
            initValue();
        }
    }
}

/**
 * 不在支持 emits
 */
// props.rule.emits?.forEach(item => {
//     addEmit(item);
// })

if (props.rule.on) {
    for (let onName in props.rule.on) {
        addOn(onName);
    }
}

defineExpose({
    getValue,
    setValue,
    setProps,
    setI18n,
    addOn,
    delOn,
    setDisabled,
})

</script>