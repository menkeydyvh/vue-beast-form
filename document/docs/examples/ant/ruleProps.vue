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
        title: "限制：最小0，最大50，步长50",
        type: "a-input-number",
        field: "num",
        props: {
          min: 0,
          max: 50,
          step: 10,
          placeholder: "请输入",
        },
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
