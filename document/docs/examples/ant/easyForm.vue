<template>
  <div>表单值：{{ value }}</div>
  <br />
  <json-layout :rule="rule" v-model="value" />
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { JsonLayout } from "json-layout";

export default {
  components: { JsonLayout },
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
          type: "a-form-item",
          children: [
            {
              type: "a-button",
              props: {
                type: "primary",
              },
              children: ["保存"],
              style: "margin-right:10px",
              on: {
                click: (e, api) => {
                  console.log(api.getData());
                },
              },
            },
            {
              type: "a-button",
              children: ["取消"],
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
