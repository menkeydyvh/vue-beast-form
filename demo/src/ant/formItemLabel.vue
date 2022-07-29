<template>
  <a-card
    class="content-card"
    :bordered="false"
    title="title是json的解析 | 指令调试 | style | class | attrs "
  >
    <beast-form v-model="value" :rule="rule" :option="option" />
    <span v-test1>{{ value }}</span>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import vbf, { BeastForm } from "../../../components";
import type { RuleType } from "../../../components";

BeastForm.useFramework = "ant-design-vue";

export default defineComponent({
  components: { BeastForm },
  setup() {
    // 指令
    vbf.directive("test2", {
      mounted() {
        console.log("directive:test2");
      },
    });

    const value = ref({ goods_name: "123", name: "123" }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          layout: "vertical",
        },
      });

    rule.value = [
      {
        type: "a-input",
        title: {
          type: "span",
          children: ["商品名称1"],
        },
        field: "name",
        value: "iphone 7",
        props: {
          type: "text",
        },
        children: [{ type: "span", slot: "prefix", children: ["前面"] }],
        validate: [
          { required: true, message: "请输入name", trigger: "blur" },
          {
            validator: (_r, v, c, api) => {
              if (v === "123") {
                return Promise.resolve();
              } else {
                return Promise.reject("请填入123");
              }
            },
            trigger: "blur",
          },
        ],
      },
      {
        type: "a-input",
        title: {
          type: "span",
          children: ["商品名称2"],
        },
        field: "name2",
        value: "good2",
        props: {
          class: "input-props-class",
          type: "text",
          attr1: "input-prop-attr1",
          attr2: "input-prop-attr2",
          style: {
            color: "#0ff",
            "border-top": "1px solid #00f",
          },
        },
        children: [{ type: "span", slot: "prefix", children: ["prefix"] }],
        directives: [["test1"], ["test2"]],
        class: "input-class",
        attrs: {
          attr1: "input-attr1",
          attr2: "input-attr2",
        },
        style: {
          "border-bottom": "2px solid #f00",
        },
      },
      {
        type: "div",
        children: ["测试class、attr、style"],
        attrs: {
          attr1: "1",
          attr2: "2",
        },
        style: {
          fontSize: "14px",
          color: "#0f0",
        },
        class: "test-div-class",
        on: {
          click: (e, f) => {
            console.log(rule.value);
            console.log("on:click");
          },
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
                props: {
                  type: "primary",
                  htmlType: "sbumit",
                },
                children: ["提交"],
              },
              {
                type: "a-button",
                children: ["重置"],
              },
            ],
          },
        ],
      },
    ];

    return {
      value,
      rule,
      option,
    };
  },
});
</script>
