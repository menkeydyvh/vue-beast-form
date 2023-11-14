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
        type: "div",
        field: "name1",
        children: [
          { type: "a-input", field: "one", title: "name1.one" },
          { type: "a-input", field: "two", title: "name1.two" },
        ],
      },
      {
        type: "div",
        field: "name2",
        children: [{ type: "a-input", field: "one", title: "name2.one" }],
      },
      {
        type: "div",
        children: [
          {
            type: "a-button",
            children: ["设置field=name2.one的值"],
            on: {
              click: (e, api) => {
                api.setValue("name2.one", "title");
              },
            },
          },
          {
            type: "a-button",
            children: ["设置field=two的值"],
            on: {
              click: (e, api) => {
                api.setValue("two", "title");
              },
            },
          },
        ],
      },
    ]),
      api = ref();
    return {
      api,
      rule,
    };
  },
};
</script>
