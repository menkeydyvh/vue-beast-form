<template>
  <beast-form :rule="rule" v-model="value" :option="{
    form: { layout: 'vertical' },
    framework: 'ant-design-vue',
  }" />
</template>
<script>
import { defineComponent, ref } from "vue";
import Group from "./components/group.vue";
import { components, BeastForm } from "vue-beast-form";

components({ Group });

export default defineComponent({
  components: { BeastForm },
  setup() {
    const rule = ref(),
      value = ref();

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
                ],
              },
            },
          ],
        },
      },
      {
        type: "group",
        title: "group2 对应结果  ['','']",
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
          ],
        },
      },
      {
        type: "a-button",
        props: {
          type: "primary",
        },
        children: ["submit提交"],
        on: {
          click: (e, api) => {
            api.validate((valid, data) => {
              console.log(valid, data);
            });
          },
        },
      },
      {
        type: "a-button",
        children: ["group2 设置第二个input1的值"],
        on: {
          click: (e, api) => {
            const group2input2Api = api.getComponent("group2").exposed.apis[1];
            if (group2input2Api) {
              group2input2Api.setValue("input1", `${Date.now()}`);
            } else {
              alert("未找到 group2 第二个input1");
            }
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
