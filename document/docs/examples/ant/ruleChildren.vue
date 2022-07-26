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
        type: "a-row",
        children: [
          { type: "a-col", props: { span: 12 }, children: ["col1-12"] },
          { type: "a-col", props: { span: 12 }, children: ["col2-12"] },
        ],
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
