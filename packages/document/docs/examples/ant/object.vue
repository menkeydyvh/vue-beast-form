<template>
  <beast-form :rule="rule" :option="{ form: { layout: 'vertical' } }" />
</template>
<script>
import { defineComponent, ref, onMounted } from "vue";
import vbf from "vue-beast-form";

// 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
vbf.useFramework("ant-design-vue");

export default defineComponent({
  components: { BeastForm: vbf.beastForm() },
  setup() {
    const rule = ref();

    rule.value = [
      {
        type: "beast-form",
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
                name: "subForm1-name",
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
            api.validate((valid, data) => {
              console.log(valid, data);
            });
          },
        },
      },
      {
        type: "a-button",
        children: ["设置subForm1 input2得值"],
        on: {
          click: (e, api) => {
            api.getApi("subForm1-name").setValue("groupInput2", `${Date.now()}`);
          },
        },
      },
    ];

    return {
      rule,
    };
  },
});
</script>
