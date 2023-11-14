<template>
  <beast-form :rule="rule" :option="{
    // 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
    framework: 'ant-design-vue',
  }" />
</template>

<script>
import { ref } from "vue";
import { BeastForm } from "vue-beast-form";

export default {
  components: { BeastForm },
  setup() {
    const rule = ref([
      {
        title: "有title",
        type: "a-input",
        field: "inp1",
        props: {
          placeholder: "正常title",
        },
      },
      {
        title: {
          type: "a-badge",
          props: {
            count: 1,
          },
          children: ["对象title"],
        },
        type: "a-input",
        field: "inp2",
        props: {
          placeholder: "对象title",
        },
      },
      {
        title: false,
        type: "a-input",
        field: "inp3",
        props: {
          placeholder: "无title",
        },
      },
    ]);
    return {
      rule,
    };
  },
};
</script>
