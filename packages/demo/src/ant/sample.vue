<template>
  <a-card class="content-card" :bordered="false" title="测试渲染示例">
    <beast-form v-model="value" :rule="rule" :option="option" />
    <div v-test1>{{ value }}</div>
    <div>{{ rule }}</div>
    <a-button @click="onAdd">add</a-button>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { BeastForm, RuleType, ruleStringify, ruleParse } from "vue-beast-form";

export default defineComponent({
  components: { BeastForm },
  setup() {
    const jApi = ref(),
      value = ref({ name: "name" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          layout: "vertical",
        },
        isI18n: true,
        framework: 'ant-design-vue'
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
        title: { type: 'div', children: ['商品名称2'] },
        field: "goods_name",
        value: "goods2",
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
                children: ["提交"],
                on: {
                  click: (e, api) => {
                    console.log(api.getFormData());
                  },
                },
              },
              {
                type: "a-button",
                field: "btn",
                props: {},
                children: ["重置"],
                on: {
                  click: (e, api) => {
                    api.resetFormData();
                  },
                },
              },
              {
                type: "a-button",
                field: "btn",
                props: {},
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
    // console.log(vbf.ruleParse(str));

    rule.value = ruleParse(str) as RuleType[];
    onMounted(() => { });

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
