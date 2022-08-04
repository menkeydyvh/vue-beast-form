<template>
  <a-card class="content-card" :bordered="false" title="测试拖拽插槽渲染示例">
    <beast-form v-model="value" :rule="rule" :option="option" />
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import vbf from "../../../components";
import type { RuleType } from "../../../components";
import draggable from "vuedraggable";

vbf.useFramework("ant-design-vue");
vbf.components({ draggable });

export default defineComponent({
  components: { BeastForm: vbf.beastForm() },
  setup() {
    const value = ref({}),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          layout: "vertical",
        },
      });

    rule.value = [
      {
        type: "draggable",
        props: {
          itemKey: "id",
          list: [
            { id: 1, name: "name1" },
            { id: 2, name: "name2" },
          ],
        },
        children: {
          item: ({ element }) => [
            {
              type: "div",
              children: [element.name],
            },
          ],
        },
      },
    ];

    onMounted(() => {});

    return {
      value,
      rule,
      option,
    };
  },
});
</script>
