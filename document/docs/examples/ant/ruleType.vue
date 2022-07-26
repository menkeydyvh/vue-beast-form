<template>
  <beast-form :rule="rule" />
</template>

<script>
import { ref } from "vue";
import { BeastForm } from "vue-beast-form";

export default {
  components: { BeastForm },
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
