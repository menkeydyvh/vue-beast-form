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
