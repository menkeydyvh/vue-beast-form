<template>
  <json-layout :rule="rule" />
</template>

<script>
import { ref } from "vue";
import { JsonLayout } from "json-layout";

export default {
  components: { JsonLayout },
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
