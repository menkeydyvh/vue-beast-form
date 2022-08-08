<template>
  <a-card class="content-card" :bordered="false" title="测试渲染示例">
    <div></div>

    <div>beast-form：name=form1</div>
    <beast-form name="form1" :rule="rule1" :option="option" />

    <div>beast-form：name=form2</div>
    <beast-form name="form2" :rule="rule2" :option="option" />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import vbf from "../../../components";
import type { RuleType } from "../../../components";

vbf.useFramework("ant-design-vue");

export default defineComponent({
  components: { BeastForm: vbf.beastForm() },
  setup() {
    const rule1 = ref<RuleType[]>([
        {
          type: "a-input",
          title: "form1的输入框",
          field: "name",
          props: {
            type: "text",
          },
        },
        {
          type: "a-button",
          field: "btn",
          children: ["设置form2的输入框值"],
          on: {
            click: (e, api) => {
              api.getApi("form2").setValue("name", "通过getApi从form1设置form2的值");
            },
          },
        },
      ]),

      rule2 = ref<RuleType[]>([
        {
          type: "a-input",
          title: "form2的输入框",
          field: "name",
          props: {
            type: "text",
          },
        },
        {
          type: "a-button",
          field: "btn",
          children: ["设置form1的输入框值"],
          on: {
            click: (e, api) => {
              api.getApi("form1").setValue("name", "通过getApi从form2设置form1的值");
            },
          },
        },
      ]),
      
      option = ref({
        form: {
          layout: "vertical",
        },
      });

    return {
      rule1,
      rule2,
      option,
    };
  },
});
</script>
