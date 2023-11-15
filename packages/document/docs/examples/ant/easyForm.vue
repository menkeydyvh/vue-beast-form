<template>
  <div>表单值：{{ value }}</div>
  <br />
  <beast-form :rule="rule" v-model="value" :option="{
    form: { layout: 'vertical' },
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
        title: "名称",
        type: "a-input",
        field: "name",
        props: {
          placeholder: "请输入",
        },
        children: [],
      },
      {
        type: "a-space",
        children: [
          {
            type: "a-button",
            props: {
              type: "primary",
            },
            children: ["保存"],
            on: {
              click: (e, api) => {
                alert(JSON.stringify(api.getFormData()));
              },
            },
          },
          {
            type: "a-button",
            children: ["取消"],
            on: {
              click: (e, api) => {
                api.resetFormData();
              },
            },
          },
        ],
      },
    ]),
      value = ref();
    return {
      rule,
      value,
    };
  },
};
</script>
