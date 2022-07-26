<template>
  <div>表单值：{{ value }}</div>
  <br />
  <beast-form :rule="rule" v-model="value" />
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
          validate: [{ required: true, message: "必须填写" }],
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
                  api.validate((valid, data) => {});
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
