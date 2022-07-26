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
        title: "值20",
        type: "a-input-number",
        field: "num",
        props: {
          placeholder: "请输入",
        },
        value: 20,
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
