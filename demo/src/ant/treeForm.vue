<template>
    <a-card class="content-card" :bordered="false" title="tree组件 支持多个v-model处理">
        <json-layout :rule="rule" v-model="value" v-model:api="jApi" :option="{
            form: {
                layout: 'vertical'
            }
        }" />

        {{ value }}
    </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
// import JsonLayout from 'json-layout'
// import { RuleType } from 'json-layout/lib/types'
import JsonLayout from '../../../components'
import type { RuleType } from '../../../components/types'

export default defineComponent({
    components: { JsonLayout },
    setup() {
        const rule = ref<RuleType[]>(),
            value = ref({}),
            jApi = ref();

        rule.value = [
            {
                type: 'a-tree',
                title: "树组件",
                field: "input",
                props: {
                    autoExpandParent: true,
                    checkable: true,
                    treeData: [
                        {
                            title: 'parent 1',
                            key: '0-0',
                            children: [
                                {
                                    title: 'parent 1-0',
                                    key: '0-0-0',
                                    disabled: true,
                                    children: [
                                        { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
                                        { title: 'leaf', key: '0-0-0-1' },
                                    ],
                                },
                                {
                                    title: 'parent 1-1',
                                    key: '0-0-1',
                                    children: [{ key: '0-0-1-0', title: 'sss' }],
                                },
                            ],
                        },
                    ]
                },
            },
            {
                type: 'a-button',
                props: {
                    type: 'primary',
                    onClick: () => {
                        jApi.value.validate((valid: boolean) => {
                            console.log(valid, jApi.value.getFormData())
                        })
                    }
                },
                children: ['submit提交']
            },
        ]

        return {
            jApi,
            value,
            rule,
        }
    }
})
</script>