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
