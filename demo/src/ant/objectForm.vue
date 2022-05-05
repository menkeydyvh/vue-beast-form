<template>
  <a-card class="content-card" :bordered="false" title="object的处理">
    <json-layout ref="jsonLayoutRef" :rule="rule" v-model:api="jApi" :option="{
            form: {
                layout: 'vertical'
            }
        }" />
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
// import JsonLayout from 'json-layout'
import JsonLayout from "../../../components";
import type { RuleType } from "../../../components/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const rule = ref<RuleType[]>(),
      jsonLayoutRef = ref(),
      jApi = ref();
    onMounted(() => {
      console.log(jsonLayoutRef.value);
    });
    rule.value = [
      {
        type: "a-input",
        title: "外层input1",
        field: "input1",
        validate: [{ required: true, message: "必须填写" }],
      },
      {
        type: "json-layout",
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
              type: "json-layout",
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
          onClick: () => {
            jApi.value.validate((valid: boolean) => {
              console.log("api.validate():", valid);
              if (valid) {
                console.log("data:", jApi.value.getFormData());
              }
            });
          },
        },
        children: ["submit提交"],
      },
    ];

    return {
      jApi,
      rule,
      jsonLayoutRef,
    };
  },
});
</script>