<template>
  <a-card class="content-card" :bordered="false" title="upload组件">
    <beast-form :rule="rule" v-model="value" :option="{
      form: {
        layout: 'vertical',
      },
      framework: 'ant-design-vue',
    }" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { InboxOutlined } from "@ant-design/icons-vue";
import { BeastForm, components, RuleType } from "vue-beast-form";

components({ InboxOutlined });

export default defineComponent({
  components: { BeastForm },
  setup() {
    const rule = ref<RuleType[]>(),
      value = ref({
        input1: [
          {
            uid: "-1",
            name: "xxx.png",
            status: "done",
            url:
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
            thumbUrl:
              "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
          },
        ],
      });

    rule.value = [
      {
        type: "a-upload",
        title: "上传",
        field: "input1",
        props: {
          listType: "picture",
          action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        },
        children: [{ type: "a-button", children: ["上传"] }],
      },
      {
        type: "a-upload-dragger",
        title: "上传",
        field: "input2",
        props: {
          listType: "picture",
          multiple: true,
          action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
        },
        children: [
          {
            type: "p",
            props: {
              class: "ant-upload-drag-icon",
            },
            children: [{ type: "inbox-outlined" }],
          },
          {
            type: "p",
            props: {
              class: "ant-upload-text",
            },
            children: ["Click or drag file to this area to upload"],
          },
          {
            type: "p",
            props: {
              class: "ant-upload-hint",
            },
            children: [
              "Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files",
            ],
          },
        ],
      },
      {
        type: "a-button",
        props: {
          type: "primary",
        },
        children: ["submit提交"],
        on: {
          click: (e, api) => {
            api.validate((valid: boolean) => {
              console.log(valid, api.getFormData());
            });
          },
        },
      },
    ];

    return {
      value,
      rule,
    };
  },
});
</script>
