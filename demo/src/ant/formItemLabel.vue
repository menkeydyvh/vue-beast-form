
<template>
  <a-card class="content-card" :bordered="false" title="title是json的解析">
    <JsonLayout v-model:api="jApi" :rule="rule" :option="option" />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import JsonLayout from 'json-layout'

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
                children: ['重置']
              }
            ]
          }
        ]
      }
    ]


    const onSubmit = (data: any) => {
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
