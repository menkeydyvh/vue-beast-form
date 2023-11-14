<template>
  <beast-form :rule="rule" @input3click="input3click" :option="{
    // 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
    framework: 'ant-design-vue',
  }" />
</template>

<script>
import { ref } from "vue";
import { BeastForm } from "vue-beast-form";

export default {
  components: { BeastForm },
  setup() {
    const rule = ref([
      {
        type: "a-input",
        field: "input",
        title: "组件1",
        props: {
          placeholder: "请输入",
        },
      },
      {
        type: "a-input",
        field: "input2",
        title: "组件2",
        props: {
          placeholder: "请输入",
        },
        validate: [{ required: true, message: "必须填写" }],
      },
      {
        type: "a-input",
        field: "input3",
        title: "组件3",
        props: {
          placeholder: "请输入",
        },
        validate: [{ required: true, message: "必须填写" }],
      },
      {
        type: "div",
        children: [
          {
            type: "a-button",
            children: ["setValue('组件1','123')"],
            on: {
              click: (e, api) => {
                api.setValue("input", "123");
              },
            },
          },
          {
            type: "a-button",
            children: ["setClass('组件1','setClass-class')"],
            on: {
              click: (e, api) => {
                api.setClass("input", "setClass-class");
              },
            },
          },
          {
            type: "a-button",
            children: ["setStyle('组件1')"],
            on: {
              click: (e, api) => {
                api.setStyle("input", {
                  border: "solid 2px red",
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["setAttrs('组件1')"],
            on: {
              click: (e, api) => {
                api.setAttrs("input", {
                  addAttr: "addAttr",
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["setProps('组件1','placeholder','')"],
            on: {
              click: (e, api) => {
                api.setProps("input", "placeholder", "已设置新的placeholder");
              },
            },
          },
          {
            type: "a-button",
            children: ["setFormItemClass('组件1','setFormItemClass-class')"],
            on: {
              click: (e, api) => {
                api.setFormItemClass("input", ["setFormItemClass-class"]);
              },
            },
          },
          {
            type: "a-button",
            children: ["setFormItemStyle('组件1',border)"],
            on: {
              click: (e, api) => {
                api.setFormItemStyle("input", {
                  border: "solid 1px blue",
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["setDisplay('组件1',false)"],
            on: {
              click: (e, api) => {
                api.setDisplay("input", false);
              },
            },
          },
          {
            type: "a-button",
            children: ["setDisabled('组件1',true)"],
            on: {
              click: (e, api) => {
                api.setDisabled("input", true);
              },
            },
          },
          {
            type: "a-button",
            children: ["getFormData"],
            on: {
              click: (e, api) => {
                alert(`input:${api.getFormData("input")}`);
              },
            },
          },
          {
            type: "a-button",
            children: ["resetFormData"],
            on: {
              click: (e, api) => {
                api.resetFormData("input");
              },
            },
          },
          {
            type: "a-button",
            children: ["validate"],
            on: {
              click: (e, api) => {
                api.validate((valid, data) => {
                  alert(`验证结果：${valid},值：${JSON.stringify(data)}`);
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["clearValidate"],
            on: {
              click: (e, api) => {
                api.clearValidate("input2");
              },
            },
          },
          {
            type: "a-button",
            children: ["addOn"],
            on: {
              click: (e, api) => {
                api.addOn("input2", "click", (e, api) => {
                  alert("点击了 组件2");
                });
                alert("组件2已设置好点击事件");
              },
            },
          },
          {
            type: "a-button",
            children: ["delOn"],
            on: {
              click: (e, api) => {
                api.delOn("input2", "click");
                alert("组件2 click 已移出");
              },
            },
          },
          {
            type: "a-button",
            children: ["getComponent"],
            on: {
              click: (e, api) => {
                console.log("input2 getComponent 结果:", api.getComponent("input2"));
                console.log("div getComponent 结果:", api.getComponent("div"));
              },
            },
          },
          {
            type: "a-button",
            children: ["getEl"],
            on: {
              click: (e, api) => {
                console.log("input2 getEl 结果:", api.getEl("input2"));
                console.log("div getEl 结果:", api.getEl("div"));
              },
            },
          },
        ],
      },
    ]);

    const input3click = (e, api) => {
      alert("点击了 组件3");
    };

    return {
      rule,
      input3click,
    };
  },
};
</script>
