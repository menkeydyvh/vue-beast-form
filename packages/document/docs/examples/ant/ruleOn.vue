<template>
  <beast-form :rule="rule" :option="{
    // 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
    framework: 'ant-design-vue',
  }" @mounted="onMounted" />
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
        field: 'div',
        children: ["div addOn"],
      },
    ]);

    const onMounted = (api) => {
      api.addOn('div', 'click', () => {
        alert('点击了')
      })
    }

    return {
      rule,
      onMounted,
    };
  },
});
</script>
