<template>
  <a-card class="content-card" :bordered="false" title="测试拖拽插槽渲染示例">
    <beast-form v-model="value" :rule="rule" :option="option" />
    <div>
      {{ value }}
    </div>
  </a-card>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, h } from "vue";
import { components, BeastForm, RuleType } from "vue-beast-form";
import draggable from "vuedraggable";

components({ draggable });

export default defineComponent({
  components: { BeastForm },
  setup() {
    const value = ref({
      drag: [
        { id: 1, name: "name1" },
        { id: 2, name: "name2" },
        { id: 3, name: "name3" },
        { id: 4, name: "name4" },
        { id: 5, name: "name5" },
        { id: 6, name: "name6" },
        { id: 7, name: "name7" },
        { id: 8, name: "name8" },
        { id: 9, name: "name9" },
      ]
    }),
      rule = ref<RuleType[]>([]),
      option = ref({
        form: {
          layout: "vertical",
        },
        framework: 'ant-design-vue',
      });

    rule.value = [
      {
        type: "draggable",
        field: "drag",
        props: {
          itemKey: "id",
        },
        children: {
          item: ({ element }) => {
            return [
              {
                type: "div",
                children: [element.name],
              },
            ];
          },
        },
      },
    ];

    onMounted(() => { });

    return {
      value,
      rule,
      option,
    };
  },
});
</script>
