<template>
  <beast-form :rule="rule" />
</template>

<script>
import { ref } from "vue";
import vbf from "vue-beast-form";

// 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
vbf.useFramework("ant-design-vue");

export default {
  components: { BeastForm: vbf.beastForm() },
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
