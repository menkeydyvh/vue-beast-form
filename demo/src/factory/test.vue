<template>
  <a-card class="content-card" :bordered="false" title="test">
    <json-layout v-model="value" v-model:api="jApi" :rule="rule" :option="option" />
    <div>{{ value }}</div>
    <div>
      <button @click="log()">打印规则</button>
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import JsonLayout from 'json-layout'
import JsonLayout from "./components";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const jApi = ref(),
      value = ref({ goods_name: "123", name: "123" }),
      rule = ref([]),
      option = ref({
        form: {
          // wrapperCol: { span: 14 },
          layout: "vertical",
        },
      });

    // 指令
    // JsonLayout.directives = {
    //   test2: {
    //     mounted() {
    //       console.log("directive:test2");
    //     },
    //   },
    // };

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
        // validate: [{ required: true, message: "请输入name", trigger: "blur" }],
        // on: {
        //   change: (e, f) => {
        //     console.log("on:change", e, f);
        //   },
        //   "update:value": (v, f) => {
        //     console.log("update:value:", v, f);
        //   },
        // },
      },
    ];

    const log = () => {
      console.log(rule.value);
    };

    return {
      jApi,
      value,
      rule,
      option,
      log,
    };
  },
});
</script>
