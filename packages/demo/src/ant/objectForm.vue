<template>
  <a-card class="content-card" :bordered="false" title="object的处理">
    {{ value }}
    <beast-form v-model="value" :rule="rule" :option="{
      form: {
        layout: 'vertical',
      },
      framework: 'ant-design-vue',
    }" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { BeastForm, RuleType, ApiType } from "vue-beast-form";

export default defineComponent({
  components: { BeastForm },
  setup() {
    const rule = ref<RuleType[]>();
    const value = ref();

    rule.value = [
      {
        type: "a-input",
        title: "外层input1",
        field: "input1",
        validate: [{ required: true, message: "必须填写" }],
      },
      {
        type: "BeastForm",
        title: "subForm",
        field: "subForm",
        props: {
          rule: [
            {
              type: "a-input",
              title: "Group Input",
              field: "groupInput",
              validate: [{ required: true, message: "必须填写" }],
            },
            {
              type: "a-input",
              title: "Group Input2",
              field: "groupInput2",
            },
            {
              type: "beast-form",
              title: "subForm1",
              field: "subForm1",
              props: {
                rule: [
                  {
                    type: "a-input",
                    title: "Group Input",
                    field: "groupInput",
                    validate: [{ required: true, message: "必须填写" }],
                  },
                  {
                    type: "a-input",
                    title: "Group Input2",
                    field: "groupInput2",
                  },
                ],
              },
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
            api.validate((valid: boolean) => {
              console.log("api.validate():", valid);
              if (valid) {
                console.log("data:", api.getFormData());
              }
            });
          },
        },
      },
    ];

    return {
      rule,
      value,
    };
  },
});
</script>
