<template>
  <beast-form :rule="rule" @divClick="onDivClick" />
</template>

<script>
import { ref } from "vue";
import vbf from "vue-beast-form";

// 有emits配置需要这句话避免警告
vbf.emits("divClick");

// 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
vbf.useFramework("ant-design-vue");

export default {
  components: { BeastForm: vbf.beastForm() },
  setup() {
    // 指令
    vbf.directive("test2", {
      mounted() {
        console.log("指令打印", "directive:test2");
      },
    });

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
};
</script>
