<template>
  <a-card class="content-card" :bordered="false" title="api测试用例">
    <json-layout
      :rule="rule"
      v-model="value"
      v-model:api="jApi"
      :option="{
        form: {
          layout: 'vertical',
        },
      }"
      :disabled="disabled"
    />
    <br />
    <a-button @click="disabled = !disabled">整个表单禁用启用</a-button>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { JsonLayout } from "../../../components";
import type { RuleType, ApiFnType } from "../../../components/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const rule = ref<RuleType[]>(),
      value = ref({}),
      disabled = ref(),
      jApi = ref<ApiFnType>();

    let disbaled = false,
      display = true;

    rule.value = [
      {
        type: "a-input",
        title: "input1",
        field: "input1",
        validate: [{ required: true, message: "必须填写", trigger: "blur" }],
      },
      {
        type: "a-input",
        title: "input2",
        field: "input2",
      },
      {
        type: "div",
        field: "divtest",
        children: ["这是一个div"],
      },
      {
        type: "json-layout",
        title: "subForm",
        field: "subForm",
        props: {
          rule: [
            {
              type: "a-input",
              title: "Group Input",
              field: "groupInput",
              validate: [{ required: true, message: "必须填写" }],
            },
            {
              type: "a-input",
              title: "Group Input2",
              field: "groupInput2",
            },
          ],
        },
      },
      {
        type: "json-layout",
        title: "subForm1",
        field: "subForm1",
        props: {
          rule: [
            {
              type: "a-input",
              title: "Group Input",
              field: "groupInput",
              validate: [{ required: true, message: "必须填写" }],
            },
            {
              type: "a-input",
              title: "Group Input2",
              field: "groupInput2",
            },
          ],
        },
      },
      {
        type: "div",
        props: {
          style: "padding:16px 0",
        },
        children: [
          {
            type: "a-button",
            field: "divBtn",
            props: {
              type: "primary",
            },
            children: ["展示用的按钮"],
          },
        ],
      },
      {
        type: "div",
        children: [
          {
            type: "a-button",
            props: {
              onClick: () => {
                display = !display;
                jApi.value.setDisplay("input1", display);
              },
            },
            children: ["隐藏显示input1"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                disbaled = !disbaled;
                jApi.value.setDisabled("input2", disbaled);
                jApi.value.getProps("divBtn").loading = disbaled;
              },
            },
            children: ["禁用启用按钮和input2"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                // value.value.input1 = '14141';
                jApi.value.setValue("input1", "123456");
              },
            },
            children: ["设置input1值"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                jApi.value.validate((valid: boolean) => {
                  console.log("api.validate()", valid);
                });
              },
            },
            children: ["验证"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                jApi.value.clearValidate();
              },
            },
            children: ["清除验证"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                jApi.value.validate((valid: boolean) => {
                  console.log("api.validate('input1')", valid);
                }, "input1");
              },
            },
            children: ["验证input1"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                jApi.value.clearValidate("input1");
              },
            },
            children: ["清除验证input1"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                jApi.value.setChildren("divtest", [
                  "覆盖了",
                  { type: "span", children: ["ddd"] },
                ]);
              },
            },
            children: ["div内容变更"],
          },
          {
            type: "a-button",
            children: ["设置subForm的titile"],
            on: {
              click: (e: any, f: ApiFnType) => {
                f.setTitle("subForm", "123");
                console.log(e);
              },
            },
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                console.log("当前页面 value", value.value);
                console.log("api.getFormData()", jApi.value.getFormData());
              },
            },
            children: ["表单数据"],
          },
          {
            type: "a-button",
            props: {
              onClick: () => {
                jApi.value.clearValue();
              },
            },
            children: ["清空表单数据"],
          },
        ],
      },
    ];

    return {
      jApi,
      value,
      rule,
      disabled,
    };
  },
});
</script>
