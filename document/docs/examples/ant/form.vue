<template>
  <beast-form v-model="value" :rule="rule" :option="option" :disabled="disabled" />
</template>

<script>
import { defineComponent, ref } from "vue";
import vbf from "vue-beast-form";

vbf.useFramework("ant-design-vue");

export default defineComponent({
  components: { BeastForm: vbf.beastForm() },
  setup() {
    const disabled = ref(false),
      value = ref(),
      rule = ref([]),
      option = ref({
        form: {
          layout: "vertical",
        },
      });

    rule.value = [
      {
        type: "a-input",
        title: "input",
        field: "input",
        value: "iphone 7",
        props: {
          type: "text",
        },
        validate: [{ required: true, message: "必须填写", trigger: "blur" }],
      },
      {
        type: "a-select",
        title: "select",
        field: "select",
        value: "7",
        props: {
          options: [
            { value: "7", label: "iphone 7", disabled: true },
            { value: "71", label: "iphone 71", disabled: false },
            { value: "72", label: "iphone 72" },
            { value: "73", label: "iphone 73" },
          ],
        },
        validate: [{ required: true, message: "必须填写", trigger: "blur" }],
      },
      {
        type: "a-auto-complete",
        title: "auto-complete",
        field: "autoComplete",
        value: "7",
        props: {
          options: [
            { value: "7", label: "iphone 7", disabled: true },
            { value: "71", label: "iphone 71", disabled: false },
            { value: "72", label: "iphone 72" },
            { value: "73", label: "iphone 73" },
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
            { value: "7", label: "iphone 7", disabled: true },
            {
              value: "71",
              label: "iphone 71",
              children: [
                { value: "72-1", label: "iphone 72-1" },
                { value: "72-2", label: "iphone 72-2" },
              ],
            },
            { value: "72", label: "iphone 72" },
            { value: "73", label: "iphone 73" },
          ],
        },
      },
      {
        type: "a-checkbox",
        title: "checkbox",
        field: "checkbox",
        children: ["checkbox"],
        props: {},
      },
      {
        type: "a-checkbox-group",
        title: "checkbox-group",
        field: "checkboxGroup",
        props: {
          options: [
            { value: "7", label: "iphone 7", disabled: true },
            { value: "71", label: "iphone 71", disabled: false },
            { value: "72", label: "iphone 72" },
            { value: "73", label: "iphone 73" },
          ],
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
        value: ["01:06:00", "05:00:00"],
        props: {
          valueFormat: "HH:mm:ss",
        },
      },
      {
        type: "a-input-number",
        title: "input-number",
        field: "inputNumber",
        props: {
          formatter: (value) => {
            return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          },
          parser: (value) => {
            return value.replace(/\$\s?|(,*)/g, "");
          },
        },
      },
      {
        type: "a-mentions",
        title: "mentions",
        field: "mentions",
        props: {
          options: [
            { value: "7", label: "iphone 7", disabled: true },
            { value: "71", label: "iphone 71", disabled: false },
            { value: "72", label: "iphone 72" },
            { value: "73", label: "iphone 73" },
          ],
        },
      },
      {
        type: "a-radio",
        title: "radio",
        field: "radio",
        children: ["Radio"],
      },
      {
        type: "a-radio-group",
        title: "radio-group",
        field: "radioGroup",
        props: {
          options: [
            { value: "7", label: "iphone 7", disabled: true },
            { value: "71", label: "iphone 71", disabled: false },
            { value: "72", label: "iphone 72" },
            { value: "73", label: "iphone 73" },
          ],
        },
      },
      {
        type: "a-rate",
        title: "rate",
        field: "rate",
        value: 2,
      },
      {
        type: "a-slider",
        title: "slider",
        field: "slider",
        value: 20,
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
          render: (item) => item.title,
          // key 必须是字符串
          dataSource: [
            { key: "1", title: "title1" },
            { key: "2", title: "title2" },
            { key: "3", title: "title3" },
          ],
        },
      },
      {
        type: "a-tree-select",
        title: "tree-select",
        field: "treeSelect",
        props: {
          treeData: [
            { value: "1", title: "title 1" },
            { value: "2", title: "title 2" },
            {
              title: "title 3",
              value: "3",
              children: [
                {
                  title: "title 3-1",
                  value: "3-1",
                  children: [
                    { title: "my leaf", value: "leaf1" },
                    { title: "your leaf", value: "leaf2" },
                  ],
                },
                { title: "title 3-2", value: "3-2" },
              ],
            },
          ],
        },
      },
      {
        type: "a-form-item",
        children: [
          {
            type: "a-space",
            children: [
              {
                type: "a-button",
                props: {
                  type: "primary",
                },
                children: ["提交"],
                on: {
                  click: (e, api) => {
                    api.validate((valid, data) => {
                      console.log(valid, data);
                    });
                  },
                },
              },
              {
                type: "a-button",
                children: ["重置"],
                on: {
                  click: (e, api) => {
                    api.resetFormData();
                    api.clearValidate();
                  },
                },
              },
              {
                type: "a-button",
                children: ["全部禁用"],
                on: {
                  click: (e, api) => {
                    disabled.value = !disabled.value;
                  },
                },
              },
            ],
          },
        ],
      },
    ];

    return {
      disabled,
      value,
      rule,
      option,
    };
  },
});
</script>
