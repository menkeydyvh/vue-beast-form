
<template>
  <a-card class="content-card" :bordered="false" title="JSON解析表单或解析成布局">
    <div>
      {{ value }}
    </div>
    <a-radio-group v-model:value="isForm" button-style="solid">
      <a-radio-button :value="true">解析成表单</a-radio-button>
      <a-radio-button :value="false">解析成布局</a-radio-button>
    </a-radio-group>
    <JsonLayout v-model:api="jApi" v-model="value" :isForm="isForm" :rule="rule" :option="option" @submit="onSubmit" />
  </a-card>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import JsonLayout from '@components'
// import { RuleType } from '../types'

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref(),
      isForm = ref(true),
      value = ref({ goods_name: '123' }),
      rule = ref([]),
      option = ref({
        form: {
          wrapperCol: { span: 14 },
          layout: 'vertical'
        }
      });

    const onSubmit = (data: any) => {
      console.log('jApi:', jApi.value)
      console.log('onSubmit', data)
    }, onReset = () => {
      console.log('onReset')
    }

    rule.value = [
      // {
      //   type: "a-input",
      //   title: "商品名称1",
      //   field: "goods_name",
      //   value: "iphone 7",
      //   props: {
      //     type: "text",
      //   },
      //   validate: [
      //     { required: true, message: '请输入goods_name', trigger: 'blur' },
      //   ],
      // },
      // {
      //   type: "a-input",
      //   title: "商品名称2",
      //   field: "name",
      //   value: "iphone 7",
      //   props: {
      //     type: "text",
      //   },
      //   children: [{ type: 'span', slot: 'prefix', children: ['prefix'] }],
      //   validate: [
      //     { required: true, message: '请输入name', trigger: 'blur' },
      //   ],
      // },
      // {
      //   type: "div",
      //   children: [
      //     {
      //       type: 'span',
      //       children: ['span']
      //     },
      //     {
      //       type: "a-input",
      //       field: "name1",
      //       showFormItem: false,
      //       props: {
      //         type: "password",
      //       },
      //     },
      //     "商品名称3"
      //   ],
      // },
      // {
      //   type: "a-form-item",
      //   children: [
      //     {
      //       type: "a-space",
      //       children: [
      //         {
      //           type: 'a-button',
      //           props: {
      //             type: 'primary',
      //             htmlType: 'sbumit'
      //           },
      //           children: ['提交']
      //         },
      //         {
      //           type: 'a-button',
      //           props: {
      //             onClick: onReset
      //           },
      //           children: ['重置']
      //         }
      //       ]
      //     }
      //   ]
      // }
      {
        type: 'a-button',
        props: {
          onClick: onReset
        },
        children: ['重置']
      }
    ]


    return {
      isForm,
      jApi,
      value,
      rule,
      option,
      onSubmit,
    }
  }

})
</script>
