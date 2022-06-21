<template>
  <a-card class="content-card" :bordered="false" title="设计器">
    <Designer />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Designer from "../../../designer";

export default defineComponent({
  components: { Designer },
  setup() {},
});
</script>
