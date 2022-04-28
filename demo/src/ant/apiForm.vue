<template>
    <a-card class="content-card" :bordered="false" title="tree组件 支持多个v-model处理">
        <json-layout :rule="rule" v-model="value" v-model:api="jApi" :option="{
            form: {
                layout: 'vertical'
            }
        }" :disabled="disabled" />
        <br />
        <a-button @click="disabled = !disabled">整个表单禁用启用</a-button>
    </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
// import JsonLayout from 'json-layout'
// import { RuleType } from 'json-layout/lib/types'
import JsonLayout from '../../../components'
import type { RuleType, ApiFnType } from '../../../components/types'

export default defineComponent({
    components: { JsonLayout },
    setup() {
        const rule = ref<RuleType[]>(),
            value = ref({}),
            disabled = ref(),
            jApi = ref<ApiFnType>();

        let disbaled = false, display: any = null;

        rule.value = [
            {
                type: 'a-input',
                title: "input1",
                field: "input1",
                validate: [
                    { required: true, message: '必须填写', trigger: 'blur' },
                ],
            },
            {
                type: 'a-input',
                title: "input2",
                field: "input2",
            },
            {
                type: 'div',
                field: "divtest",
                children: ['这是一个div']
            },
            {
                type: 'div',
                props: {
                    style: 'padding:16px 0'
                },
                children: [{
                    type: 'a-button',
                    field: "divBtn",
                    props: {
                        type: 'primary',
                    },
                    children: ['展示用的按钮']
                }]
            },
            {
                type: "div",
                children: [
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                display = display ? null : 'if';
                                jApi.value.display('input1', display)
                            }
                        },
                        children: ['隐藏显示input1']
                    },
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                disbaled = !disbaled
                                jApi.value.disabled('input2', disbaled)
                                jApi.value.disabled('divBtn', disbaled)
                            }
                        },
                        children: ['禁用启用按钮和input2']
                    },
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                jApi.value.setFieldValue('input1', '123456')
                                console.log('api.setFieldValue()')
                            }
                        },
                        children: ['设置input1值']
                    },
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                console.log('api.getRule()', jApi.value.getRule('divtest'))
                            }
                        },
                        children: ['获取div的规则']
                    },
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                jApi.value.updateRule('divtest', {
                                    children: ['覆盖这个内容']
                                })
                            }
                        },
                        children: ['覆盖规则']
                    },
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                jApi.value.validate((valid: boolean) => {
                                    console.log('api.validate()', valid)
                                })
                            }
                        },
                        children: ['验证']
                    },
                    {
                        type: 'a-button',
                        props: {
                            onClick: () => {
                                console.log('当前页面 value', value.value)
                                console.log('api.getFormData()', jApi.value.getFormData())
                            }
                        },
                        children: ['表单数据']
                    },
                ]
            }

        ]

        return {
            jApi,
            value,
            rule,
            disabled,
        }
    }
})
</script>