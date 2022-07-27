<template>
  <beast-form :rule="rule" @input3click="input3click" />
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
        field: "div",
      },
      {
        type: "div",
        children: [
          {
            type: "a-button",
            children: ["setValue"],
            on: {
              click: (e, api) => {
                api.setValue("input", "123");
              },
            },
          },
          {
            type: "a-button",
            children: ["setClass"],
            on: {
              click: (e, api) => {
                api.setClass("input", "setClass-class");
              },
            },
          },
          {
            type: "a-button",
            children: ["setStyle"],
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
            children: ["setAttrs"],
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
            children: ["setProps"],
            on: {
              click: (e, api) => {
                api.setProps("input", "placeholder", "已设置新的placeholder");
              },
            },
          },
          {
            type: "a-button",
            children: ["setFormItemClass"],
            on: {
              click: (e, api) => {
                api.setFormItemClass("input", ["setFormItemClass-class"]);
              },
            },
          },
          {
            type: "a-button",
            children: ["setFormItemStyle"],
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
            children: ["setDisplay"],
            on: {
              click: (e, api) => {
                api.setDisplay("input", false);
              },
            },
          },
          {
            type: "a-button",
            children: ["setDisabled"],
            on: {
              click: (e, api) => {
                api.setDisabled("input", true);
              },
            },
          },
          {
            type: "a-button",
            children: ["pushChildren"],
            on: {
              click: (e, api) => {
                api.pushChildren("div", {
                  type: "a-alert",
                  props: {
                    message: "插入成功",
                  },
                });
              },
            },
          },
          {
            type: "a-button",
            children: ["delChildren"],
            on: {
              click: (e, api) => {
                api.delChildren("div");
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
            children: ["addEmit"],
            on: {
              click: (e, api) => {
                api.addEmit("input3", {
                  event: "click",
                  alias: "input3click",
                });
                alert("组件3已设置好点击监听");
              },
            },
          },
          {
            type: "a-button",
            children: ["delOnOrEmit"],
            on: {
              click: (e, api) => {
                api.delOnOrEmit("input2", "click");
                api.delOnOrEmit("input3", "click");
                alert("组件2和组件3 click已移出");
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
