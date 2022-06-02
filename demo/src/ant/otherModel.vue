<template>
  <a-card class="content-card" :bordered="false" title="其他支持多个v-model处理">
    <json-layout
      :rule="rule"
      v-model="value"
      v-model:api="jApi"
      :option="{
        form: {
          layout: 'vertical',
        },
      }"
    />
    {{ value }}
  </a-card>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { JsonLayout } from "../../../components";
import type { RuleType, ApiFnType } from "../../../components/types";

export default defineComponent({
  components: { JsonLayout },
  setup() {
    const rule = ref<RuleType[]>(),
      value = ref({}),
      jApi = ref<ApiFnType>();

    rule.value = [
      {
        type: "a-tree",
        title: "树组件",
        field: "tree",
        props: {
          autoExpandParent: true,
          checkable: true,
          treeData: [
            {
              title: "parent 1",
              key: "0-0",
              children: [
                {
                  title: "parent 1-0",
                  key: "0-0-0",
                  disabled: true,
                  children: [
                    { title: "leaf", key: "0-0-0-0", disableCheckbox: true },
                    { title: "leaf", key: "0-0-0-1" },
                  ],
                },
                {
                  title: "parent 1-1",
                  key: "0-0-1",
                  children: [{ key: "0-0-1-0", title: "sss" }],
                },
              ],
            },
          ],
        },
        vModelKey: ["expandedKeys", "selectedKeys", "checkedKeys"],
      },
      {
        type: "a-menu",
        title: "菜单组件",
        field: "menu",
        props: {
          mode: "inline",
        },
        children: [
          { type: "a-menu-item", props: { key: "item1" }, children: ["menuItem1"] },
          {
            type: "a-sub-menu",
            props: { key: "sub1", title: "sub1" },
            children: [
              { type: "a-menu-item", props: { key: "item2" }, children: ["sub1-menu2"] },
              { type: "a-menu-item", props: { key: "item3" }, children: ["sub1-menu3"] },
            ],
          },
          {
            type: "a-sub-menu",
            props: { key: "sub2", title: "sub2" },
            children: [
              { type: "a-menu-item", props: { key: "item4" }, children: ["sub2-menu4"] },
              { type: "a-menu-item", props: { key: "item5" }, children: ["sub2-menu5"] },
            ],
          },
        ],
        vModelKey: ["openKeys", "selectedKeys"],
        vModelKeyDefaultValue: [[], []],
      },
      {
        type: "a-pagination",
        title: "分页组件",
        field: "pagination",
        props: {
          total: 50,
          pageSize: 10,
        },
        vModelKey: "current",
      },
      {
        type: "a-steps",
        title: "步骤组件",
        field: "steps",
        children: [
          { type: "a-step", props: { title: "第 1 步" } },
          { type: "a-step", props: { title: "第 2 步" } },
          { type: "a-step", props: { title: "第 3 步" } },
          { type: "a-step", props: { title: "第 4 步" } },
          { type: "a-step", props: { title: "第 5 步" } },
        ],
        value: 2,
        vModelKey: "current",
      },
      {
        type: "a-collapse",
        title: "折叠面板组件",
        field: "collapse",
        children: [
          {
            type: "a-collapse-panel",
            props: { header: "第 1 步", key: "1" },
            children: ["第 1 步内容"],
          },
          {
            type: "a-collapse-panel",
            props: { header: "第 2 步", key: "2" },
            children: ["第 2 步内容"],
          },
          {
            type: "a-collapse-panel",
            props: { header: "第 3 步", key: "3" },
            children: ["第 3 步内容"],
          },
          {
            type: "a-collapse-panel",
            props: { header: "第 4 步", key: "4" },
            children: ["第 4 步内容"],
          },
        ],
        vModelKey: "activeKey",
      },
      {
        type: "a-tabs",
        title: "标签页组件",
        field: "tabs",
        children: [
          {
            type: "a-tab-pane",
            props: { tab: "第 1 步", key: "1" },
            children: ["第 1 步内容"],
          },
          {
            type: "a-tab-pane",
            props: { tab: "第 2 步", key: "2" },
            children: ["第 2 步内容"],
          },
          {
            type: "a-tab-pane",
            props: { tab: "第 3 步", key: "3" },
            children: ["第 3 步内容"],
          },
        ],
        value: "1",
        vModelKey: "activeKey",
      },
      {
        type: "a-drawer",
        field: "drawer",
        props: {
          title: "抽屉组件Title",
        },
        children: ["抽屉组件内容"],
        vModelKey: "visible",
      },
      {
        type: "a-button",
        props: {
          type: "primary",
          onClick: () => {
            jApi.value.validate((valid: boolean) => {
              console.log(valid, jApi.value.getFormData());
            });
          },
        },
        children: ["submit提交"],
      },
      {
        type: "a-button",
        props: {
          onClick: () => {
            jApi.value.setValue("drawer", true);
          },
        },
        children: ["显示抽屉"],
      },
    ];

    return {
      jApi,
      value,
      rule,
    };
  },
});
</script>
