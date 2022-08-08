<template>
  <beast-form :rule="rule" />
</template>

<script>
import { ref } from "vue";
import vbf from "vue-beast-form";
import draggable from "vuedraggable";

// 如果$beastForm.base有配置且不需要切换$beastForm.frameworks无需使用这条
vbf.useFramework("ant-design-vue");
vbf.components({ draggable });

export default {
  components: { BeastForm: vbf.beastForm() },
  setup() {
    const rule = ref([
      { type: "div", children: ["数组渲染："] },
      {
        type: "a-row",
        children: [
          { type: "a-col", props: { span: 12 }, children: ["col1-12"] },
          { type: "a-col", props: { span: 12 }, children: ["col2-12"] },
        ],
      },
      { type: "br" },
      { type: "div", children: ["对象函数渲染："] },
      {
        type: "draggable",
        props: {
          itemKey: "id",
          list: [
            { id: 1, name: "name1" },
            { id: 2, name: "name2" },
            { id: 3, name: "name3" },
            { id: 4, name: "name4" },
          ],
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
    ]);
    return {
      rule,
    };
  },
};
</script>
