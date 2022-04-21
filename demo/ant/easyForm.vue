
<template>
  <a-card class="content-card" :bordered="false" title="JSON解析表单或解析成布局">
    <a-row>
      <a-col flex="auto">
        <div>
          <a-radio-group v-model:value="isForm" button-style="solid">
            <a-radio-button :value="true">解析成表单</a-radio-button>
            <a-radio-button :value="false">解析成布局</a-radio-button>
          </a-radio-group>
        </div>
        <json-layout v-model:api="jApi" v-model="value" :isForm="isForm" :rule="rule" :option="option"
          @submit="onSubmit" />
      </a-col>
      <a-col flex="300px">
        <pre v-text="JSON.stringify(value, null, 4)" />
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import JsonLayout from '@components'
import { RuleType } from '@components/types'

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref(),
      isForm = ref(true),
      value = ref({ input: '123' }),
      rule = ref<Array<RuleType>>([]),
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
      value.value = {
        input: 'onReset'
      }
    }

    rule.value = [
      {
        type: "a-input",
        title: "input",
        field: "input",
        value: "iphone 7",
        props: {
          type: "text",
        },
        validate: [
          { required: true, message: '必须填写', trigger: 'blur' },
        ],
      },
      {
        type: "a-select",
        title: "select",
        field: "select",
        value: "7",
        props: {
          options: [
            { value: '7', label: "iphone 7", disabled: true, },
            { value: '71', label: "iphone 71", disabled: false, },
            { value: '72', label: "iphone 72" },
            { value: '73', label: "iphone 73" },
          ],
        },
        validate: [
          { required: true, message: '必须填写', trigger: 'blur' },
        ],
      },
      {
        type: "a-auto-complete",
        title: "auto-complete",
        field: "autoComplete",
        value: "7",
        props: {
          options: [
            { value: '7', label: "iphone 7", disabled: true, },
            { value: '71', label: "iphone 71", disabled: false, },
            { value: '72', label: "iphone 72" },
            { value: '73', label: "iphone 73" },
          ],
        },
      },
      {
        type: "a-cascader",
        title: "cascader",
        field: "cascader",
        value: ["7"],
        props: {
          options: [
            { value: '7', label: "iphone 7", disabled: true },
            {
              value: '71', label: "iphone 71", children: [
                { value: '72-1', label: "iphone 72-1" },
                { value: '72-2', label: "iphone 72-2" },
              ]
            },
            { value: '72', label: "iphone 72" },
            { value: '73', label: "iphone 73" },
          ],
        },
      },
      {
        type: "a-checkbox",
        title: "checkbox",
        field: "checkbox",
        children: ['checkbox'],
        props: {},
      },
      {
        type: "a-checkbox-group",
        title: "checkbox-group",
        field: "checkboxGroup",
        props: {
          options: [
            { value: '7', label: "iphone 7", disabled: true, },
            { value: '71', label: "iphone 71", disabled: false, },
            { value: '72', label: "iphone 72" },
            { value: '73', label: "iphone 73" },
          ]
        },
      },
      {
        type: "a-date-picker",
        title: "date-picker",
        field: "datePicker",
      },
      {
        type: "a-range-picker",
        title: "range-picker",
        field: "rangePicker",
      },
      {
        type: "a-time-picker",
        title: "time-picker",
        field: "timePicker",
      },
      {
        type: "a-time-range-picker",
        title: "time-range-picker",
        field: "timeRangePicker",
        props: {
          valueFormat: 'HH:mm:ss'
        }
      },
      {
        type: "a-input-number",
        title: "input-number",
        field: "inputNumber",
        props: {
          formatter: (value: string) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
          parser: (value: string) => value.replace(/\$\s?|(,*)/g, '')
        }
      },
      {
        type: "a-mentions",
        title: "mentions",
        field: "mentions",
        props: {
          options: [
            { value: '7', label: "iphone 7", disabled: true, },
            { value: '71', label: "iphone 71", disabled: false, },
            { value: '72', label: "iphone 72" },
            { value: '73', label: "iphone 73" },
          ]
        },
      },
      {
        type: "a-radio",
        title: "radio",
        field: "radio",
        children: ['Radio'],
      },
      {
        type: "a-radio-group",
        title: "radio-group",
        field: "radioGroup",
        props: {
          options: [
            { value: '7', label: "iphone 7", disabled: true, },
            { value: '71', label: "iphone 71", disabled: false, },
            { value: '72', label: "iphone 72" },
            { value: '73', label: "iphone 73" },
          ]
        }
      },
      {
        type: "a-rate",
        title: "rate",
        field: "rate",
        value: 2
      },
      {
        type: "a-slider",
        title: "slider",
        field: "slider",
        value: 20
      },
      {
        type: "a-switch",
        title: "switch",
        field: "switch",
      },
      {
        type: "a-transfer",
        title: "transfer",
        field: "transfer",
        props: {
          // 必须配置
          render: (item: any) => item.title,
          // key 必须是字符串
          dataSource: [
            { key: "1", title: 'title1' },
            { key: "2", title: 'title2' },
            { key: "3", title: 'title3' },
          ]
        }
      },
      {
        type: "a-tree-select",
        title: "tree-select",
        field: "treeSelect",
        props: {
          treeData: [
            { value: "1", title: 'title 1' },
            { value: "2", title: 'title 2' },
            {
              title: 'title 3',
              value: '3',
              children: [
                {
                  title: 'title 3-1',
                  value: '3-1',
                  children: [
                    { title: 'my leaf', value: 'leaf1' },
                    { title: 'your leaf', value: 'leaf2' },
                  ],
                },
                { title: 'title 3-2', value: '3-2' },
              ],
            },
          ]
        }
      },
      {
        type: "div",
        children: [
          {
            type: 'span',
            children: ['showFormItem=false']
          },
          {
            type: "a-input",
            field: "inputPassword",
            showFormItem: false,
            props: {
              type: "password",
            },
          },
          "input下方"
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
                props: {
                  onClick: onReset
                },
                children: ['重置']
              }
            ]
          }
        ]
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
