<template>
  <el-card class="content-card" :bordered="false" header="JSON解析表单或解析成布局">
    <el-row>
      <el-col :span="18">
        <el-space>
          <el-radio-group v-model="option.isForm" button-style="solid">
            <el-radio-button :label="true">解析成表单</el-radio-button>
            <el-radio-button :label="false">解析成布局</el-radio-button>
          </el-radio-group>
          <el-button @click="disabled = !disabled">{{
            disabled ? "启用表单" : "禁用表单"
          }}</el-button>
        </el-space>
        <beast-form
          v-model:api="jApi"
          v-model="value"
          :rule="rule"
          :option="option"
          :disabled="disabled"
        />
      </el-col>
      <el-col :span="6">
        <pre v-text="JSON.stringify(value, null, 4)" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, markRaw } from "vue";
import { BeastForm } from "../../../components";
import type { RuleType } from "../../../components/types";

BeastForm.useFramework = "element-plus";

export default defineComponent({
  components: { BeastForm },
  setup() {
    const jApi = ref(),
      disabled = ref(false),
      value = ref({ input: "input" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          "label-position": "top",
        },
        isForm: true,
      });

    const selectOptions = [
      { value: "7", label: "iphone 7", disabled: true },
      { value: "71", label: "iphone 71", disabled: false },
      { value: "72", label: "iphone 72" },
      { value: "73", label: "iphone 73" },
    ];

    const cascaderOptions = [
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
    ];

    rule.value = [
      {
        type: "el-input",
        title: "input",
        field: "input",
        value: "iphone 7",
        props: {
          type: "text",
        },
        validate: [{ required: true, message: "必须填写", trigger: "blur" }],
      },
      {
        type: "el-select",
        title: "select",
        field: "select",
        value: "7",
        children: selectOptions.map((item) => {
          return {
            type: "el-option",
            props: {
              label: item.label,
              value: item.value,
              disabled: item.disabled === true,
            },
          };
        }),
        validate: [{ required: true, message: "必须填写", trigger: "blur" }],
      },
      {
        type: "el-autocomplete",
        title: "autocomplete",
        field: "autoComplete",
        value: "7",
        props: {
          fetchSuggestions: (queryString, callback) => {
            const result = queryString
              ? selectOptions.filter((itme) => itme.value.indexOf(queryString) > -1)
              : selectOptions;
            callback(result);
          },
        },
      },
      // 弹出框不显示label问题
      {
        type: "el-cascader",
        title: "cascader",
        field: "cascader",
        props: {
          options: cascaderOptions,
        },
      },
      {
        type: "el-checkbox",
        title: "checkbox",
        field: "checkbox",
        children: ["checkbox"],
      },
      {
        type: "el-checkbox-group",
        title: "checkbox-group",
        field: "checkboxGroup",
        children: selectOptions.map((item) => {
          return {
            type: "el-checkbox",
            props: {
              label: item.value,
              disabled: item.disabled === true,
            },
            children: [item.label],
          };
        }),
      },
      // 颜色值一直默认是#ff0000 ???  这个弹框如果出来过其他弹出框会出现bug
      {
        type: "div",
        style: "color:#ff0000",
        children: ["el-color-picker控件有bug无法正常展示先屏蔽掉了"],
      },
      // {
      //   type: "el-color-picker",
      //   title: "colorPicker",
      //   field: "colorPicker",
      // },
      {
        type: "el-date-picker",
        title: "date-picker",
        field: "datePicker",
      },
      {
        type: "el-date-picker",
        title: "range-picker",
        field: "rangePicker",
        props: {
          type: "daterange",
        },
      },
      {
        type: "el-time-picker",
        title: "time-picker",
        field: "timePicker",
      },
      {
        type: "el-time-picker",
        title: "time-range-picker",
        field: "timeRangePicker",
        props: {
          isRange: true,
        },
      },
      {
        type: "el-time-select",
        title: "time-select",
        field: "timeSelect",
      },
      {
        type: "el-input-number",
        title: "input-number",
        field: "inputNumber",
      },
      {
        type: "el-radio",
        title: "radio",
        field: "radio",
        props: {
          label: true,
        },
        children: ["Radio"],
      },
      {
        type: "el-radio-group",
        title: "radio-group",
        field: "radioGroup",
        children: selectOptions.map((item) => {
          return {
            type: "el-radio",
            props: {
              label: item.value,
              disabled: item.disabled === true,
            },
            children: [item.label],
          };
        }),
      },
      {
        type: "el-rate",
        title: "rate",
        field: "rate",
      },
      {
        type: "el-select-v2",
        title: "虚拟列表选择器",
        field: "selectv2",
        props: {
          options: selectOptions,
        },
      },
      {
        type: "el-slider",
        title: "slider",
        field: "slider",
      },
      {
        type: "el-switch",
        title: "switch",
        field: "switch",
      },
      {
        type: "el-transfer",
        title: "transfer",
        field: "transfer",
        props: {
          renderContent: (h, data) => {
            return h("span", null, data.label);
          },
          data: [
            { key: "1", label: "title1" },
            { key: "2", label: "title2" },
            { key: "3", label: "title3" },
          ],
        },
      },
      {
        type: "el-form-item",
        children: [
          {
            type: "el-space",
            children: [
              {
                type: "el-button",
                props: {
                  type: "primary",
                  htmlType: "sbumit",
                  onClick: () => {
                    if (option.value.isForm) {
                      jApi.value.validate((valid: boolean) => {
                        console.log(valid, jApi.value.getFormData(), value.value);
                      });
                    } else {
                      // 不是form的时候获取数据
                      console.log("formData:", jApi.value.getFormData());
                    }
                  },
                },
                children: ["提交"],
              },
              {
                type: "el-button",
                props: {
                  onClick: () => {
                    value.value = {
                      input: "onReset",
                    };
                  },
                },
                children: ["重置"],
              },
            ],
          },
        ],
      },
    ];

    return {
      disabled,
      jApi,
      value,
      rule,
      option,
    };
  },
});
</script>
