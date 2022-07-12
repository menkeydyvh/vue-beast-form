<template>
  <beast-form :rule="rule" :option="{ isForm: false }" />
</template>

<script>
import { ref, defineComponent } from "vue";
import { BeastForm } from "vue-beast-form";

export default defineComponent({
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
});
</script>
