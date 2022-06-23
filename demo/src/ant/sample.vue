<template>
  <a-card class="content-card" :bordered="false" title="测试渲染示例">
    <json-layout v-model="value" v-model:api="jApi" :rule="rule" :option="option" />
    <test-json-layout :rule="rule" :option="option" />
    <span v-test1>{{ value }}</span>
    <a-button @click="onAdd">add</a-button>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { JsonLayout, TestJsonLayout } from "../../../components";
import { ruleStringify, ruleParse } from "../../../components/tool";
import type { RuleType } from "../../../components/types";

export default defineComponent({
  components: { JsonLayout, TestJsonLayout },
  setup() {
    const jApi = ref(),
      value = ref({ name: "name" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          layout: "vertical",
        },
      });

    const testRule = [
      {
        type: "a-input",
        title: "商品名称1",
        field: "name",
        value: "iphone 7",
        props: {
          type: "text",
        },
      },
      {
        type: "a-input",
        title: "商品名称2",
        field: "goods_name",
        props: {
          type: "text",
        },
      },
      {
        type: "a-form-item",
        children: [
          {
            type: "a-space",
            children: [
              {
                type: "a-button",
                field: "btn",
                props: {},
                children: ["提交"],
              },
            ],
            on: {
              click: (e, api) => {
                console.log(api.getFormData());
              },
            },
          },
          {
            type: "a-space",
            children: [
              {
                type: "a-button",
                field: "btn",
                props: {},
                children: ["重置"],
              },
            ],
            on: {
              click: (e, api) => {
                api.resetFormData();
              },
            },
          },
          {
            type: "a-space",
            children: [
              {
                type: "a-button",
                field: "btn",
                props: {},
                children: ["清空"],
              },
            ],
            on: {
              click: (e, api) => {
                api.clearValue("name");
              },
            },
          },
        ],
      },
    ];
    const onAdd = () => {
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

    onMounted(() => {
      rule.value.push({
        type: "div",
        children: ["onMounted后设置"],
      });
    });

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
