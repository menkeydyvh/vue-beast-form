<template>
  <el-card class="content-card" :bordered="false" header="测试渲染示例">
    <beast-form v-model="value" :rule="rule" :option="option" />
    <span v-test1>{{ value }}</span>
    <a-button @click="onAdd">add</a-button>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import vbf, { BeastForm } from "../../../components";
import { ruleStringify, ruleParse } from "vue-beast-form/lib/tool";
import type { RuleType } from "vue-beast-form";

vbf.useForm("element-plus");

export default defineComponent({
  components: { BeastForm },
  setup() {
    const jApi = ref(),
      value = ref({ name: "name" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          "label-position": "top",
        },
        isI18n: true,
      });

    const testRule = [
      {
        type: "el-input",
        title: "商品名称1",
        field: "name",
        value: "iphone 7",
        props: {
          type: "text",
        },
      },
      {
        type: "el-input",
        title: "商品名称2",
        field: "goods_name",
        value: "goods2",
        props: {
          type: "text",
        },
      },
      {
        type: "el-form-item",
        children: [
          {
            type: "el-space",
            children: [
              {
                type: "el-button",
                field: "btn",
                children: ["提交"],
                on: {
                  click: (e, api) => {
                    console.log(api.getFormData());
                  },
                },
              },
              {
                type: "el-button",
                field: "btn",
                children: ["重置"],
                on: {
                  click: (e, api) => {
                    api.resetFormData();
                  },
                },
              },
              {
                type: "el-button",
                field: "btn",
                children: ["设置1"],
                on: {
                  click: (e, api) => {
                    api.setValue("name", "1");
                  },
                },
              },
            ],
          },
        ],
      },
    ];

    const onAdd = () => {
      console.log("add");
      rule.value.push({
        type: "div",
        children: ["onAdd设置"],
      });
    };

    // rule.value = testRule;

    const str = ruleStringify(testRule);
    // console.log(str);
    // console.log(ruleParse(str));

    rule.value = ruleParse(str);
    onMounted(() => {});

    return {
      jApi,
      value,
      rule,
      option,
      onAdd,
    };
  },
});
</script>
