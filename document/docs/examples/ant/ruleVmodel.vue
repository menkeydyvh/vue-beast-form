<template>
  <div>value: {{ value }}</div>
  <br />
  <beast-form :rule="rule" v-model="value" />
</template>

<script>
import { ref } from "vue";
import { BeastForm } from "vue-beast-form";

export default {
  components: { BeastForm },
  setup() {
    const rule = ref([
        {
          type: "a-menu",
          title: "菜单组件",
          field: "menu",
          props: {
            theme: "dark",
            mode: "inline",
          },
          children: [
            { type: "a-menu-item", props: { key: "item1" }, children: ["menuItem1"] },
            {
              type: "a-sub-menu",
              props: { key: "sub1", title: "sub1" },
              children: [
                {
                  type: "a-menu-item",
                  props: { key: "item2" },
                  children: ["sub1-menu2"],
                },
                {
                  type: "a-menu-item",
                  props: { key: "item3" },
                  children: ["sub1-menu3"],
                },
              ],
            },
            {
              type: "a-sub-menu",
              props: { key: "sub2", title: "sub2" },
              children: [
                {
                  type: "a-menu-item",
                  props: { key: "item4" },
                  children: ["sub2-menu4"],
                },
                {
                  type: "a-menu-item",
                  props: { key: "item5" },
                  children: ["sub2-menu5"],
                },
              ],
            },
          ],
          vModelKey: ["openKeys", "selectedKeys"],
          vModelKeyDefaultValue: [[], []],
        },
      ]),
      value = ref();
    return {
      rule,
      value,
    };
  },
};
</script>
