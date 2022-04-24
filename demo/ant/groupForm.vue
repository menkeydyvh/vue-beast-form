<template>
    <json-layout ref="jsonLayoutRef" :rule="rule" v-model:api="jApi" :option="{
        form: {
            layout: 'vertical'
        }
    }" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import JsonLayout from '@components'
import Group from './components/group.vue';
import type { RuleType } from '@components/types'

export default defineComponent({
    components: { JsonLayout, Group },
    setup() {
        const rule = ref<RuleType[]>(),
            jsonLayoutRef = ref(),
            jApi = ref();

        rule.value = [
            {
                type: 'group',
                title: "group1",
                field: "group1",
                value: [{ input1: '1', input2: '1' }],
                props: {
                    rule: [
                        {
                            type: 'a-input',
                            title: "input1",
                            field: "input1",
                            validate: [
                                { required: true, message: '必须填写' },
                            ],
                        },
                        {
                            type: 'a-input',
                            title: "input2",
                            field: "input2",
                            validate: [
                                { required: true, message: '必须填写' },
                            ],
                        },
                    ]
                }
            },
            {
                type: 'group',
                title: "group2",
                field: "group2",
                value: ['1', '2'],
                props: {
                    field: 'input1',
                    rule: [
                        {
                            type: 'a-input',
                            title: "input1",
                            field: "input1",
                            validate: [
                                { required: true, message: '必须填写' },
                            ],
                        },
                        {
                            type: 'a-input',
                            title: "input2",
                            field: "input2",
                        },
                    ]
                }
            },
            {
                type: 'a-button',
                props: {
                    type: 'primary',
                    onClick: () => {
                        jApi.value.validate((valid: boolean) => {
                            console.log('api.validate():', valid)
                            if (valid) {
                                console.log('data:', jApi.value.getFormData())
                            }
                        })
                    }
                },
                children: ['submit提交']
            },
        ]

        return {
            jApi,
            rule,
            jsonLayoutRef
        }
    }
})
</script>