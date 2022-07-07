<template>
  <beast-form :rule="rule"  />
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
        children: ["hello word"],
        style: "color:#00f;border:1px solid #000",
        on: {
          click: () => {
            alert("点击了！");
          },
        },
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
