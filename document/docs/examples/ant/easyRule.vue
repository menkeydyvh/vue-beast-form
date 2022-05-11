<template>
  <json-layout v-model="value" :rule="rule" />
</template>

<script>
import { ref } from "vue";
import JsonLayout from "json-layout";

export default {
  components: { JsonLayout },
  setup() {
    const rule = ref([
        {
          type: "div",
          children: ["hello word"],
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
