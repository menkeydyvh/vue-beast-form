<template>
  <beast-form :rule="rule" />
</template>

<script>
import { ref } from "vue";
import vbf from "vue-beast-form";

// 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
vbf.useFramework("ant-design-vue");

export default {
  components: { BeastForm: vbf.beastForm() },
  setup() {
    const rule = ref([
      {
        type: "div",
        class: "add-class",
        children: ["div string add class"],
      },
      {
        type: "div",
        class: ["add-class1", "add-class2"],
        children: ["div string[] add class"],
      },
      {
        type: "div",
        style: "background:green",
        children: ["div string add style"],
      },
      {
        type: "div",
        style: { border: "red 1px solid" },
        children: ["div object add style"],
      },
      {
        type: "div",
        attrs: {
          a: 1,
        },
        children: ["div add attrs"],
      },
      {
        type: "a-input",
        title: "输入框组件设置formItem层",
        field: "t1",
        style: { border: "red 1px solid" },
        class: ["itemClass"],
        attrs: { itemAttr: 1 },
      },
      {
        type: "a-input",
        title: "输入框组件设置Input",
        field: "t2",
        props: {
          style: { border: "red 1px solid" },
          class: ["inputClass"],
          inputAttr: 1,
        },
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
