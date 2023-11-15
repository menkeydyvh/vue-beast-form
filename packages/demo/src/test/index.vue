<template>
    <a-card class="content-card" :bordered="false" title="测试">
        test
        <TestSetup v-model:value="value" :num="num" />
        <a-button @click="() => {
            num++;
        }">num++</a-button>
    </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import TestSetup from "./components/testSetup.vue";

export default defineComponent({
    components: { TestSetup },
    setup() {
        const value = ref({});
        const num = ref(0);


        return {
            value,
            num,
        };
    },
});
</script>
  