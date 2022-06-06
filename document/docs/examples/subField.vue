<template>
  <json-layout :rule="rule" />
</template>

<script>
import { ref } from "vue";
import { JsonLayout } from "json-layout";

export default {
  components: { JsonLayout },
  setup() {
    const rule = ref([
        {
          type: "div",
          field: "name1",
          children: [
            { type: "a-input", field: "one", title: "name1.one" },
            { type: "a-input", field: "two", title: "name1.two" },
          ],
        },
        {
          type: "div",
          field: "name2",
          children: [{ type: "a-input", field: "one", title: "name2.one" }],
        },
        {
          type: "div",
          children: [
            {
              type: "a-button",
              children: ["设置field=name2.one的title"],
              on: {
                click: (e, api) => {
                  api.setTitle("name2.one", "title");
                },
              },
            },
            {
              type: "a-button",
              children: ["设置field=two的title"],
              on: {
                click: (e, api) => {
                  api.setTitle("two", "title");
                },
              },
            },
          ],
        },
      ]),
      api = ref();
    return {
      api,
      rule,
    };
  },
};
</script>
