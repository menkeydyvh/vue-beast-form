<template>
  <a-card class="content-card" :bordered="false" title="数组的处理，引入Group组件">
    <json-layout :rule="rule" v-model:api="jApi" :option="{
            form: {
                layout: 'vertical'
            }
        }" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
// import JsonLayout from 'json-layout'
import Group from "./components/group.vue";
import JsonLayout from "../../../components";
import type { RuleType } from "../../../components/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const rule = ref<RuleType[]>(),
      jApi = ref();

    // 导入组件 用法和当前组件的按需引入一样
    JsonLayout.components = { Group };

    rule.value = [
      {
        type: "group",
        title: "group 对应结果  [object,object,object]",
        field: "group1",
        value: [{ input1: "1", input2: "1" }],
        props: {
          rule: [
            {
              type: "a-input",
              title: "input1",
              field: "input1",
              validate: [{ required: true, message: "必须填写" }],
            },
            {
              type: "a-input",
              title: "input2",
              field: "input2",
              validate: [{ required: true, message: "必须填写" }],
            },
            {
              type: "group",
              title: "group1-1",
              field: "group1-1",
            //   value: ["1", "2"],
              props: {
                field: "input1",
                rule: [
                  {
                    type: "a-input",
                    title: "input1",
                    field: "input1",
                    validate: [{ required: true, message: "必须填写" }],
                  },
                  {
                    type: "a-input",
                    title: "input2",
                    field: "input2",
                  },
                ],
              },
            },
          ],
        },
      },
      {
        type: "group",
        title: "group 对应结果  ['','']",
        field: "group2",
        value: ["1", "2"],
        props: {
          field: "input1",
          rule: [
            {
              type: "a-input",
              title: "input1",
              field: "input1",
              validate: [{ required: true, message: "必须填写" }],
            },
            {
              type: "a-input",
              title: "input2",
              field: "input2",
            },
          ],
        },
      },
      {
        type: "a-button",
        props: {
          type: "primary",
          onClick: () => {
            jApi.value.validate((valid: boolean) => {
              console.log(valid, jApi.value.getFormData());
            });
          },
        },
        children: ["submit提交"],
      },
    ];

    return {
      jApi,
      rule,
    };
  },
});
</script>