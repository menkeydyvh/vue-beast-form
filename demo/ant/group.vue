<template>
    <json-layout :rule="rule" v-model:api="jApi" :option="{
        form: {
            layout: 'vertical'
        }
    }" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import JsonLayout from '@components'
import { RuleType } from '@components/types'

export default defineComponent({
    components: { JsonLayout },
    setup() {
        const rule = ref<RuleType[]>(),
            jApi = ref();

        rule.value = [
            {
                type: 'a-input',
                title: "外层input",
                field: "input",
                validate: [
                    { required: true, message: '必须填写' },
                ],
            },
            {
                type: 'json-layout',
                title: "subForm",
                field: "subForm",
                props: {
                    rule: [
                        {
                            type: "a-input",
                            title: "Group Input",
                            field: "groupInput",
                            validate: [
                                { required: true, message: '必须填写' },
                            ],
                        },
                        {
                            type: "a-input",
                            title: "Group Input2",
                            field: "groupInput2",
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
                            console.log('api.validate():', valid,)
                        })
                    }
                },
                children: ['submit提交']
            },
        ]

        return {
            jApi,
            rule
        }
    }
})
</script>