<template>
  <beast-form :rule="rule" :option="{
    // 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
    framework: 'ant-design-vue',
  }" />
</template>

<script>
import { defineComponent, ref } from "vue";
import { BeastForm } from "vue-beast-form";

export default defineComponent({
  components: { BeastForm },
  setup() {
    const rule = ref([
      {
        type: "div",
        children: ["div on click"],
        on: {
          click: (e, api) => {
            alert("点击了");
          },
        },
      },
      {
        type: "div",
        children: ["div directives 控制台查看打印"],
        directives: [["test2"]],
      },
      {
        type: "div",
        children: ["div emits click 控制台查看打印"],
        emits: [
          {
            alias: "divClick",
            event: "click",
          },
        ],
      },
    ]);

    const onDivClick = (e, api) => {
      console.log("emits click:", e, api);
    };

    return {
      rule,
      onDivClick,
    };
  },
});
</script>
