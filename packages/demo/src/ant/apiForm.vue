<template>
  <a-card class="content-card" :bordered="false" title="api测试用例">
    <beast-form :rule="rule" v-model="value" :option="{
      form: {
        layout: 'vertical',
      },
      framework: 'ant-design-vue',
      emits: ['divBtnClick'],
    }" :disabled="disabled" @divBtnClick="divBtnClick" @changeField="changeField" />
    <br />
    <a-button @click="disabled = !disabled">整个表单禁用启用</a-button>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { BeastForm, RuleType, ApiType } from "vue-beast-form";


export default defineComponent({
  components: { BeastForm },
  setup() {
    const rule = ref<RuleType[]>(),
      value = ref({}),
      disabled = ref();

    let disbaled = false,
      display = true,
      n = 1;

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
        type: "beast-form",
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
        type: "beast-form",
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
        field: "divbtns",
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
            children: ["测试emits"],
            emits: [
              {
                alias: "divBtnClick",
                event: "click",
              },
            ],
          },
        ],
      },
      {
        type: "div",
        children: [
          {
            type: "a-button",
            children: [`${display ? "隐藏" : "显示"}显示input1`],
            on: {
              click: (e, api) => {
                display = !display;
                api.setDisplay("input1", display);
              },
            },
          },
          {
            type: "a-button",
            children: [`设置input1 input style和class`],
            on: {
              click: (e, api) => {
                api.setStyle("input2", {
                  border: `${n++}px solid red`,
                });
                api.setClass("input2", ["testInputClass", "red"]);
              },
            },
          },
          {
            type: "a-button",
            children: [`设置input1 formItem style和class`],
            on: {
              click: (e, api) => {
                api.setFormItemStyle("input2", {
                  border: `${n++}px solid yellow`,
                });
                api.setFormItemClass("input2", ["testItemClass", "yellow"]);
              },
            },
          },
          {
            type: "a-button",
            children: [`${disbaled ? "启用" : "禁用"}按钮和input2`],
            on: {
              click: (e, api) => {
                disbaled = !disbaled;
                api.setDisabled("input2", disbaled);
                api.setProps("divBtn", "loading", disbaled);
              },
            },
          },
          {
            type: "a-button",
            children: ["设置input1值"],
            on: {
              click: (e, api) => {
                api.setValue("input1", "123456");
              },
            },
          },
          {
            type: "a-button",
            children: ["验证"],
            on: {
              click: (e, api) => {
                api.validate((valid, data) => {
                  console.log("api.validate()", valid, data);
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["清除验证"],
            on: {
              click: (e, api) => {
                api.clearValidate();
              },
            },
          },
          {
            type: "a-button",
            children: ["验证input1"],
            on: {
              click: (e, api) => {
                api.validate((valid, data) => {
                  console.log("api.validate('input1')", valid, data);
                }, "input1");
              },
            },
          },
          {
            type: "a-button",
            children: ["清除验证input1"],
            on: {
              click: (e, api) => {
                api.clearValidate("input1");
              },
            },
          },
          {
            type: "a-button",
            children: ["展示按钮添加新按钮"],
            on: {
              click: (e, api) => {
                api.pushChildren(
                  "divbtns",
                  {
                    type: "a-button",
                    field: "nBtn",
                    children: ["新按钮"],
                  },
                  0
                );
                api.addOn("nBtn", "click", (e, api) => {
                  console.log("新按钮被点击", e, api);
                  api.delOnOrEmit("nBtn", "click");
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["展示按钮清除新按钮"],
            on: {
              click: (e, api) => {
                api.delChildren("divbtns", 0);
              },
            },
          },
          {
            type: "a-button",
            children: ["表单数据"],
            on: {
              click: (e, api) => {
                console.log("当前页面 value", value.value);
                console.log("api.getFormData()", api.getFormData());
              },
            },
          },
          {
            type: "a-button",
            children: ["清空表单数据"],
            on: {
              click: (e, api) => {
                api.resetFormData();
              },
            },
          },
          {
            type: "a-button",
            children: ["获取el"],
            on: {
              click: (e, api) => {
                console.log(api.getEl("subForm1"));
              },
            },
          },
          {
            type: "a-button",
            children: ["获取compoment"],
            on: {
              click: (e, api) => {
                console.log(api.getComponent("subForm1"));
              },
            },
          },
        ],
      },
    ];
    const divBtnClick = (e, api) => {
      console.log("divBtnClick:emits", api);
    },
      changeField = (field, value, api) => {
        // console.log("changeField:", field, value, api);
      };

    return {
      value,
      rule,
      disabled,
      divBtnClick,
      changeField,
    };
  },
});
</script>
