<template>
  <div>
    <div>测试渲染示例</div>
    <beast-form v-model="value" :rule="rule" :option="option" />
    <span v-test1>{{ value }}</span>
    <a-button @click="onAdd">add</a-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { BeastForm } from "../../../components";
import { ruleStringify, ruleParse } from "vue-beast-form/lib/tool";
import type { RuleType } from "vue-beast-form";

BeastForm.useFramework = "vant";


export default defineComponent({
  components: { BeastForm },
  setup() {
    const jApi = ref(),
      value = ref({ name: "name" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        isI18n: true,
      });

    const testRule = [
      {
        type: "van-cell-group",
        props: { inset: true },
        children: [
          {
            type: "van-field",
            field: "name",
            value: "iphone 7",
            props: {
              label: "商品名称",
              placeholder: "请输入商品名称",
            },
          },
          {
            type: "van-field",
            field: "goods_name",
            value: "goods2",
            props: {
              label: "商品名称2",
              placeholder: "请输入商品名称2",
            },
          },
        ],
      },

      {
        type: "div",
        children: [
          {
            type: "van-button",
            field: "btn",
            children: ["提交"],
            props: {
              type: "primary",
            },
            on: {
              click: (e, api) => {
                console.log(api.getFormData());
              },
            },
          },
          {
            type: "van-button",
            field: "btn",
            children: ["重置"],
            on: {
              click: (e, api) => {
                api.resetFormData();
              },
            },
          },
          {
            type: "van-button",
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
