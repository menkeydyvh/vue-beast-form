<template>
  <div>表单值：{{ value }}</div>
  <br />
  <beast-form :rule="rule" v-model="value" />
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
          title: "名称",
          type: "a-input",
          field: "name",
          props: {
            placeholder: "请输入",
          },
          validate: [{ required: true, message: "必须填写" }],
        },
        {
          title: "大于10",
          type: "a-input-number",
          field: "num",
          props: {
            placeholder: "请输入",
          },
          validate: [
            { required: true, message: "必须填写" },
            { type: "number", min: 10, message: "必须大于10" },
          ],
        },
        {
          title: "和上头一致",
          type: "a-input-number",
          field: "num-top",
          props: {
            placeholder: "请输入",
          },
          validate: [
            { required: true, message: "必须填写" },
            {
              validator: (_r, v) => {
                if (value.value.num === v) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("与上头数字不一致");
                }
              },
            },
          ],
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
