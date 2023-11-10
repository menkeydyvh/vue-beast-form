<template>
    <div>
        value:{{ value }}
    </div>
    <div>
        num:{{ num }}
    </div>
    <a-button @click="setValue">setValue</a-button>
</template>
<script setup lang="ts">
import { watch } from 'vue';

// 这种写法 watch不触发
// const { value, num } = defineProps<{
//     value: Object;
//     num: number;
// }>();

// watch(() => value, () => {
//     console.log('testSetup.value', value)
// }, { deep: true });

// watch(() => num, () => {
//     console.log('testSetup.num', num)
// }, { deep: true });

// watch会触发
const props = defineProps<{
    value: Object;
    num: number;
}>();


watch(() => props.value, () => {
    console.log('testSetup.value', props.value)
}, { deep: true });

watch(() => props.num, () => {
    console.log('testSetup.num', props.num)
}, { deep: true });


const emit = defineEmits<{
    "update:value": [value: any]
}>()

const setValue = () => {
    // emit('update:value', { ...value, test: 'addvalue' })
    emit('update:value', { ...props.value, test: 'addvalue' })
}

</script>