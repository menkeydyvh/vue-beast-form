
<template>
  <a-card class="content-card" :bordered="false" title="动态布局或表单JSON解析">
    <div>
      {{ value }}
    </div>
    <JsonLayout v-model:api="jApi" :rule="rule" :option="option" @submit="onSubmit" />
  </a-card>
</template>


<script lang="ts">
import { defineComponent, ref } from 'vue'
import JsonLayout from '../components/index'
// import { RuleType } from '../types'

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref(),
      value = ref({ goods_name: '123' }),
      rule = ref([]),
      option = ref({
        form: {
          // wrapperCol: { span: 14 },
          layout: 'vertical'
        }
      });

    rule.value = [
      {
        type: "a-input",
        title: "商品名称1",
        field: "goods_name",
        value: "iphone 7",
        props: {
          type: "text",
        },
        validate: [
          { required: true, message: '请输入goods_name', trigger: 'blur' },
        ],
      },
      {
        type: "a-input",
        title: {
          type: 'span',
          children: ["商品名称2"]
        },
        field: "name",
        value: "iphone 7",
        props: {
          type: "text",
        },
        children: [{ type: 'span', slot: 'prefix', children: ['prefix'] }],
        validate: [
          { required: true, message: '请输入name', trigger: 'blur' },
        ],
      },
      {
        type: "div",
        children: [
          {
            type: 'span',
            children: ['span']
          },
          {
            type: "a-input",
            field: "name1",
            showFormItem: false,
            props: {
              type: "password",
            },
          },
          "商品名称3"
        ],
      },
      {
        type: "a-form-item",
        children: [
          {
            type: "a-space",
            children: [
              {
                type: 'a-button',
                props: {
                  type: 'primary',
                  htmlType: 'sbumit'
                },
                children: ['提交']
              },
              {
                type: 'a-button',
                props: {},
                children: ['重置']
              }
            ]
          }
        ]
      }
    ]


    const onSubmit = (data) => {
      console.log('jApi:', jApi.value)
      console.log('onSubmit', data)
    }

    return {
      jApi,
      value,
      rule,
      option,
      onSubmit,
    }
  }

})
</script>
