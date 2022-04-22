<template>
    <a-row>
        <a-col flex="auto">
            <!-- <json-layout ref="jsonLayoutRef"  /> -->
        </a-col>
        <a-col flex="100px">
            <plus-square-outlined />
            <minus-square-outlined />
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import type { PropType } from 'vue'
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons-vue"
import JsonLayout from '@components'
import type { RuleType, PropsOptionType } from '@components/types'

export default defineComponent({
    name: 'Group',
    components: { JsonLayout, PlusSquareOutlined, MinusSquareOutlined },
    props: {
        rule: { type: Array },
        modelValue: { default: null },
        option: { type: Object as PropType<PropsOptionType> },
        "onUpdate:modelValue": { type: Function },
    },
    setup() {
        const rule = ref<RuleType[]>(),
            jApi = ref();

        onMounted(() => {
        })


        return {
            jApi,
            rule,
        }
    }
})
</script>