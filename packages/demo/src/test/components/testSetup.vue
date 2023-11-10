<template>
    <div>
        value:{{ value }}
    </div>
    <div>
        num:{{ num }}
    </div>
    <div>
        component :is 渲染的ui
        <div>
            <component ref="inputRef" :is="inputComp" :="inputProps"></component>
            <component :is="btnComp" :="btnProps" @click="setBtnProps">componentBtn</component>
        </div>
    </div>
    <a-button @click="setValue">setValue</a-button>
    <a-button :="btnProps" @click="setBtnProps">setBtnProps</a-button>
</template>
<script setup lang="ts">
import { getCurrentInstance, watch, ref, reactive, toRefs } from 'vue';
// import { Button, Input } from 'ant-design-vue';

interface Props {
    value: Object;
    num: number;
}

const emit = defineEmits<{
    "update:value": [value: any]
}>()

// 不触发 watch
// const { value, num } = defineProps<Props>();
// watch(() => value, () => {
//     console.log('testSetup.value', value)
// }, { deep: true });
// watch(() => num, () => {
//     console.log('testSetup.num', num)
// }, { deep: true });
// const setValue = () => {
//     emit('update:value', { ...value, test: 'addvalue1' })
// }

// 触发 watch
const props = defineProps<Props>();
const { value, num } = toRefs(props);
watch(value, () => {
    console.log('testSetup.value', value.value)
}, { deep: true });
watch(num, () => {
    inputProps.value = num.value
    console.log('testSetup.num', num.value)
}, { deep: true });
const setValue = () => {
    emit('update:value', { ...value.value, test: 'addvalue2' })
}

// 触发 watch
// const props = defineProps<Props>();
// watch(() => props.value, () => {
//     console.log('testSetup.value', props.value)
// }, { deep: true });
// watch(() => props.num, () => {
//     console.log('testSetup.num', props.num)
// }, { deep: true });
// const setValue = () => {
//     emit('update:value', { ...props.value, test: 'addvalue3' })
// }

const vm = getCurrentInstance();



const btnComp = vm.appContext.components.AButton;
const btnProps = reactive({})

const setBtnProps = () => {
    if (btnProps.type == "primary") {
        btnProps.type = "text"
    } else {
        btnProps.type = "primary"
    }
}

const inputRef = ref()
const inputComp = vm.appContext.components.AInput
const inputProps = reactive({
})
</script>