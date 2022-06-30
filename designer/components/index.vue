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
      <json-layout :rule="coreForm.rule" :option="coreForm.option" />
    </div>
    <div class="designer-right">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="props" tab="组件" :disabled="!recordAcitve.active">
          <json-layout
            v-model="propsForm.value"
            :rule="propsForm.rule"
            :option="propsForm.option"
            @changeField="propsChangeField"
          />
        </a-tab-pane>
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
import { defineComponent, ref, nextTick, onMounted, provide, watch } from "vue";
import jlc, { JsonLayout } from "../../components/index";
import { deepCopy } from "../../components/tool";
import Drag from "./drag.vue";
import DragTool from "./dragTool.vue";
import draggable from "vuedraggable";
import Menu from "../config/menu";
import Base from "../config/base";
import "../styles/index.less";

jlc.components({ Drag, DragTool });
let slotNotation = 0;

export default defineComponent({
  name: "Designer",
  components: { draggable, JsonLayout },
  setup(props) {
    const recordAcitve = ref({
        active: null,
      }),
      activeRule = ref(),
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
      propsForm = ref({
        value: {},
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
                handle: ".dragBtn",
                emptyInsertThreshold: 0,
                direction: "vertical",
                itemKey: "slot",
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
              add: (e) => dragAdd(e, children),
              end: (e) => dragEnd(e, children),
            },
            "draggable",
            true
          ),
        ];
      },
      dragAdd = (e, children) => {
        // 从菜单添加进来
        const newIndex = e.newIndex,
          curItem = e.item._underlying_vm_;
        if (curItem && curItem.name) {
          children.splice(newIndex, 0, makeRule(curItem, children));
        }
        console.log("dragAdd");
      },
      dragEnd = (e, children) => {
        // 拖动换位结束
        const { oldIndex, newIndex } = e,
          cacheRule = children[oldIndex];
        children.splice(oldIndex, 1);
        children.splice(newIndex, 0, cacheRule);
        console.log("dragEnd");
      },
      makeRule = (config, parentChildren) => {
        const confRule = config.rule(),
          dragToolId = `DragTool${++slotNotation}`;

        confRule._conf = config;

        let drag;

        if (config.drag) {
          const curChild = [];
          drag = makeDrag(
            curChild,
            {
              add: (e) => dragAdd(e, curChild),
              end: (e) => dragEnd(e, curChild),
            },
            confRule.type,
            config.drag
          );
          confRule.children = [drag];
        }

        if (config.children) {
          const child = makeRule(
            siderMenu.getRule(config.children),
            (drag || confRule).children
          );
          (drag || confRule).children.push(child);
        }

        // 正常设置操作层
        return {
          type: "DragTool",
          props: {
            isDrag: config.isDrag !== false,
            isChild: !!config.children,
            isMask: config.isMask,
            onlyId: dragToolId,
          },
          slot: dragToolId,
          on: {
            dragToolAdd: (onlyId) => {
              let idx = parentChildren.findIndex((item) => item.slot === onlyId);
              if (idx > -1) {
                const copyRule = deepCopy(parentChildren[idx]),
                  copyOnlyId = `DragTool${++slotNotation}`;
                copyRule.props.onlyId = copyOnlyId;
                copyRule.slot = copyOnlyId;
                parentChildren.splice(idx, 0, copyRule);
              }
            },
            dragToolDel: (onlyId) => {
              let idx = parentChildren.findIndex((item) => item.slot === onlyId);
              if (idx > -1) {
                parentChildren.splice(idx, 1);
              }
            },
            dragToolAddChild: (onlyId) => {},
            dragToolActive: (onlyId) => {
              selectDragTool(parentChildren.find((item) => item.slot === onlyId));
            },
          },
          children: [confRule],
        };
      },
      selectDragTool = (dragToolRule) => {
        if (dragToolRule) {
          activeKey.value = "props";
          activeRule.value = dragToolRule.children[0];
          const baseRules = baseConfig.baseRules();
          // 获取定义好的props
          propsForm.value.rule = [...baseRules, ...activeRule.value._conf.props()];
          // 赋值处理
          const propsValue = {
            ...activeRule.value.props,
          };
          baseRules.forEach((item) => {
            if (item.field) {
              propsValue[item.field] =
                activeRule.value[item.field.replace(baseConfig.ruleFieldPrefix, "")];
            }
          });
          propsForm.value.value = deepCopy(propsValue);
        } else {
          activeRule.value = null;
        }
      },
      propsChangeField = (field, value, api) => {
        if (activeRule.value) {
          if (field.indexOf(baseConfig.ruleFieldPrefix) === 0) {
            activeRule.value[field.replace(baseConfig.ruleFieldPrefix, "")] = value;
          } else {
            activeRule.value[field] = value;
          }
        }
      },
      onClick = () => {
        console.log(coreForm.value);
      };

    coreForm.value.rule = makeDragRule(coreForm.value.rule);

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
      propsForm,
      formProps,
      onClick,
      propsChangeField,
    };
  },
});
</script>
