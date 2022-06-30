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
      <json-layout
        :rule="coreForm.rule"
        :option="coreForm.option"
        @changeField="coreChangeField"
      />
    </div>
    <div class="designer-right">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="props" tab="组件" :disabled="!recordAcitve.active">
          <json-layout
            :modelValue="propsForm.value"
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
import { deepCopy, searchLoop } from "../../components/tool";
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
          type: "drag-tool",
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
                parentChildren.splice(idx + 1, 0, makeRule(config, parentChildren));
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
          const baseRules = baseConfig.baseRules(),
            propsRules = activeRule.value._conf.props();
          // 获取所有定义好的参数规则
          propsForm.value.rule = [...baseRules, ...propsRules];

          // 赋值处理
          const propsValue = {};

          baseRules.forEach((item) => {
            if (item.field) {
              propsValue[item.field] =
                activeRule.value[item.field.replace(baseConfig.ruleFieldPrefix, "")];
            }
          });

          propsRules.forEach((item) => {
            if (item.field) {
              propsValue[item.field] = activeRule.value?.props?.[item.field];
            }
          });

          propsForm.value.value = propsValue;
        } else {
          activeRule.value = null;
        }
      },
      // 设置value
      coreChangeField = (field, value) => {
        searchLoop(coreForm.value.rule, field, ({ item }) => {
          item.value = value;
        });
      },
      // 设置rule和props相关
      propsChangeField = (field, value) => {
        if (activeRule.value) {
          if (field.indexOf(baseConfig.ruleFieldPrefix) === 0) {
            activeRule.value[field.replace(baseConfig.ruleFieldPrefix, "")] = value;
          } else {
            if (!activeRule.value.props) {
              activeRule.value.props = {};
            }
            activeRule.value.props[field] = value;
          }
        }
      },
      // 清理不必要的值
      clearObject = (o) => {
        const oks = Object.keys(o);
        if (oks.length !== 0) {
          oks.forEach((k) => {
            if (o[k] === undefined) {
              delete o[k];
            } else if (Array.isArray(o[k]) && o[k].length === 0) {
              delete o[k];
            } else if (typeof o[k] === "object") {
              clearObject(o[k]);
            }
          });
        }
      },
      // 解析获取真实规则
      parseRule = (children) => {
        return [...children].reduce((c, rule) => {
          if (!rule) {
            return c;
          }
          if (typeof rule === "string") {
            return c;
          } else if (typeof rule === "object") {
            if (rule.type === "drag") {
              c.push(...parseRule(rule.children));
              return c;
            } else if (rule.type === "drag-tool") {
              c.push(...parseRule(rule.children));
              return c;
            } else {
              const nr = { ...rule };
              if (nr.children && nr.children.length) {
                nr.children = parseRule(nr.children);
              }
              delete nr._conf;
              clearObject(nr);
              c.push(nr);
              return c;
            }
          }
        }, []);
      },
      getRule = () => {
        return parseRule(coreForm.value.rule);
      },
      onClick = () => {
        console.log(getRule());
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
      coreChangeField,
    };
  },
});
</script>
