<template>
  <beast-form :rule="rule" :option="{
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
        title: "组件",
        props: {
          placeholder: "请输入",
        },
        display: false,
      },
      {
        type: "div",
        children: ["div"],
        display: false,
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
