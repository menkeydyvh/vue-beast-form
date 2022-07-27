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
        children: [
          { type: "span", slot: "prefix", children: ["前缀"] },
          { type: "span", slot: "suffix", children: ["后缀"] },
        ],
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
