<template>
  <a-card class="content-card" :bordered="false" title="测试渲染示例">
    <json-layout v-model="value" v-model:api="jApi" :rule="rule" :option="option" />
    <span v-test1>{{ value }}</span>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { JsonLayout } from "../../../components";
import type { RuleType } from "../../../components/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref(),
      value = ref({ goods_name: "123", name: "123" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          layout: "vertical",
        },
      });

    rule.value = [
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
                btnClick(api);
              },
            },
          },
        ],
      },
    ];

    const btnClick = (api) => {
      api.setValue("name", "dsf");
    };

    return {
      jApi,
      value,
      rule,
      option,
    };
  },
});
</script>
