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
        style: "background:#f1f1f1",
        children: ["div string add style"],
      },
      {
        type: "div",
        style: { border: "#f1f1f1 1px soild" },
        children: ["div object add style"],
      },
      {
        type: "div",
        attrs: {
          a: 1,
        },
        children: ["div add attrs"],
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
