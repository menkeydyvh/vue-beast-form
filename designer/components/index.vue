<template>
  <div class="designerBody">
    <div class="designer-left">
      <a-collapse :bordered="false" accordion>
        <a-collapse-panel v-for="menu in menus" :header="menu.title">
          <draggable
            :group="{ name: 'default', pull: 'clone', put: false }"
            :sort="false"
            item-key="name"
            :list="menu.list"
          >
            <template #item="{ element }">
              <div class="menuItem">
                {{ element.label }}
              </div>
            </template>
          </draggable>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <div class="designer-content">
      <json-layout :rule="coreForm.rule" />
    </div>
    <div class="designer-right">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="other" tab="组件" :disabled="true"
          >Content of Tab Pane 2</a-tab-pane
        >
        <a-tab-pane key="form" tab="表单">Content of Tab Pane 1</a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, markRaw } from "vue";
import { JsonLayout } from "../../components/index";
import draggable from "vuedraggable";
import Menu from "../config/menu";
import "../styles/index.less";

export default defineComponent({
  name: "Designer",
  components: { draggable, JsonLayout },
  setup(props) {
    const activeKey = ref("form"),
      menus = ref([]),
      coreForm = ref({
        rule: [],
        option: {
          form: {},
        },
      });

    const siderMenu = new Menu();
    menus.value = siderMenu.menus;

    return {
      activeKey,
      menus,
      coreForm,
    };
  },
});
</script>
