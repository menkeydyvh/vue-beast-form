<template>
  <div>
    <a-button @click="onClick">xx</a-button>
  </div>
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
        <a-tab-pane key="other" tab="组件" :disabled="!recordAcitve.active"
          >Content of Tab Pane 2</a-tab-pane
        >
        <a-tab-pane key="form" tab="表单">
          <json-layout
            v-model="coreForm.option.form"
            :rule="formProps.rule"
            :option="formProps.option"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, onMounted, provide } from "vue";
import { JsonLayout } from "../../components/index";
import Drag from "./drag";
import DragTool from "./dragTool.vue";
import draggable from "vuedraggable";
import Menu from "../config/menu";
import Base from "../config/base";
import "../styles/index.less";

JsonLayout.components = { Drag, DragTool };
let slotNotation = 0;

export default defineComponent({
  name: "Designer",
  components: { draggable, JsonLayout },
  setup(props) {
    const recordAcitve = ref({
        active: null,
      }),
      baseConfig = new Base(),
      siderMenu = new Menu(),
      activeKey = ref("form"),
      menus = ref([]),
      coreForm = ref({
        rule: [],
        option: {
          form: {
            layout: "vertical",
          },
        },
      }),
      formProps = ref({
        rule: [],
        option: {
          form: {
            layout: "vertical",
          },
        },
      });

    provide("recordAcitve", recordAcitve);

    menus.value = siderMenu.menus;
    formProps.value.rule = baseConfig.formPropsRules();

    const makeDrag = (children, on, tag, group) => {
        // drag层
        return {
          type: "drag",
          props: {
            tag,
            rule: {
              props: {
                group: group === true ? "default" : group,
                ghostClass: "ghost",
                animation: 150,
                handle: ".drag-btn",
                emptyInsertThreshold: 0,
                direction: "vertical",
                itemKey: "type",
                modelValue: children,
              },
            },
          },
          children,
          on,
        };
      },
      makeDragRule = (children) => {
        // 给children建立drag层
        return [
          makeDrag(
            children,
            {
              add: (e, api) => dragAdd(e, children, api),
              // end: (e, api) => dragEnd(e, children, api),
              // start: (e, api) => dragStart(e, children, api),
              // unchoose: (e, api) => dragUnchoose(e, children, api),
            },
            "draggable",
            true
          ),
        ];
      },
      dragAdd = (e, children, api) => {
        const newIndex = e.newIndex,
          curItem = e.item._underlying_vm_;
        if (curItem && curItem.name) {
          children.splice(newIndex, 0, makeRule(curItem));
        }
      },
      makeRule = (config) => {
        const confRule = config.rule();
        let drag;

        if (config.drag) {
          const curChild = [];
          drag = makeDrag(
            curChild,
            {
              add: (e, api) => dragAdd(e, curChild, api),
              // end: (e, api) => dragEnd(e, curChild, api),
              // start: (e, api) => dragStart(e, curChild, api),
              // unchoose: (e, api) => dragUnchoose(e, curChild, api),
            },
            confRule.type,
            config.drag
          );
          confRule.children = [drag];
        }

        if (config.children) {
          const child = makeRule(siderMenu.getRule(config.children));
          (drag || confRule).children.push(child);
        }

        // 正常设置操作层
        return {
          type: "DragTool",
          props: {
            isDrag: config.isDrag !== false,
            isChild: config.children,
          },
          slot: `slot-${++slotNotation}`,
          on: {
            dragToolAdd: (e) => {},
            dragToolDel: (e) => {},
            dragToolAddChild: (e) => {},
            dragToolCopy: (e) => {},
          },
          children: [confRule],
        };
      },
      onClick = () => {
        console.log(coreForm.value);
      };

    coreForm.value.rule = makeDragRule([]);

    onMounted(() => {
      document.body.ondrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
    });

    return {
      recordAcitve,
      activeKey,
      menus,
      coreForm,
      formProps,
      onClick,
    };
  },
});
</script>
