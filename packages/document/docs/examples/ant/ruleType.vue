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
        title: "组件",
        type: "a-input",
        props: {
          placeholder: "请输入",
        },
      },
      {
        type: "div",
        children: ["div"],
      },
      {
        type: "span",
        children: ["span"],
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
