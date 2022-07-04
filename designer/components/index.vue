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
      <beast-form
        :rule="coreForm.rule"
        :option="coreForm.option"
        @changeField="coreChangeField"
      />
    </div>
    <div class="designer-right">
      <a-tabs v-model:activeKey="activeKey" type="card">
        <a-tab-pane key="props" tab="组件" :disabled="!recordAcitve.active">
          <beast-form
            v-model="propsForm.value"
            :rule="propsForm.rule"
            :option="propsForm.option"
            @changeField="propsChangeField"
          />
        </a-tab-pane>
        <a-tab-pane key="form" tab="表单">
          <beast-form
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
import bf, { BeastForm } from "../../components";
import { deepCopy, searchLoop, randomId } from "../../components/tool";
import Drag from "./drag.vue";
import DragTool from "./dragTool.vue";
import draggable from "vuedraggable";
import Menu from "../config/menu";
import Base from "../config/base";
import "../styles/index.less";

bf.components({ Drag, DragTool });
let slotNotation = 0;

export default defineComponent({
  name: "Designer",
  components: { draggable, BeastForm },
  setup(props) {
    const recordAcitve = ref({
        active: null,
      }),
      actionRule = {
        // 选中
        activeRule: null,
        // 移动
        moveRule: null,
        // 添加
        isAdd: false,
        addRule: null,
      },
      // activeRule = ref(),
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

    menus.value = siderMenu.getMenus();
    formProps.value.rule = baseConfig.formPropsRules();

    const makeDrag = (tag, group) => {
        const dragUuid = `drag-${randomId()}`,
          children = [];
        // drag层
        return {
          type: "drag",
          field: dragUuid,
          props: {
            id: dragUuid,
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
          children: children,
          on: {
            add: (e) => dragAdd(e),
            end: (e) => dragEnd(e),
            start: (e) => dragStart(e),
            unchoose: (e) => dartUnchoose(e),
          },
        };
      },
      dragAdd = (e, children) => {
        // 从菜单添加进来
        const { newIndex, to } = e,
          curItem = e.item._underlying_vm_;
        if (curItem?.name) {
          // 从菜单添加
          searchLoop(coreForm.value.rule, to.id, ({ item }) => {
            item.children.splice(newIndex, 0, makeRule(curItem));
          });
        } else {
          // 从选中中添加
          if (actionRule.addRule) {
            const { oldIndex, from, to } = actionRule.addRule;
            let cacheRule;
            searchLoop(coreForm.value.rule, from.id, ({ item }) => {
              cacheRule = item.children.splice(oldIndex, 1);
            });
            searchLoop(coreForm.value.rule, to.id, ({ item }) => {
              item.children.splice(newIndex, 0, cacheRule[0]);
            });
          }
        }
        actionRule.isAdd = true;
        // console.log("dragAdd");
      },
      dragEnd = (e) => {
        // 拖动换位结束
        const { newIndex } = e;
        if (!actionRule.isAdd && actionRule.moveRule) {
          const { oldIndex, to } = actionRule.moveRule;
          searchLoop(coreForm.value.rule, to.id, ({ item }) => {
            const cacheRule = item.children.splice(oldIndex, 1);
            item.children.splice(newIndex, 0, cacheRule[0]);
          });
        }
        actionRule.moveRule = null;
        actionRule.addRule = null;
        actionRule.isAdd = false;
        // console.log("dragEnd");
      },
      dragStart = (e) => {
        actionRule.isAdd = false;
        actionRule.moveRule = e;
        // console.log("dragStart");
      },
      dartUnchoose = (e) => {
        actionRule.addRule = e;
        // console.log("dartUnchoose");
      },
      makeRule = (config, _cRule) => {
        const confRule = _cRule || config.rule(),
          dragToolId = `dragTool-${++slotNotation}`;

        confRule._conf = config;

        if (!confRule.props) {
          confRule.props = {};
        }

        let drag;

        if (config.drag) {
          drag = makeDrag(confRule.type, config.drag);
        }

        if (config.children && !_cRule) {
          const child = makeRule(siderMenu.getRule(config.children));
          (drag || confRule).children.push(child);
        }

        if (config.drag) {
          confRule.children = [
            {
              type: "drag-tool",
              field: dragToolId,
              props: {
                isDrag: config.isDrag !== false,
                isChild: !!config.children,
                isMask: config.isMask,
                onlyId: dragToolId,
              },
              on: {
                dragToolAdd: (onlyId) => {
                  searchLoop(coreForm.value.rule, onlyId, (_, { item, index, ary }) => {
                    ary.splice(index + 1, 0, makeRule(item._conf));
                  });
                },
                dragToolDel: (onlyId) => {
                  searchLoop(coreForm.value.rule, onlyId, (_, { index, ary }) => {
                    ary.splice(index, 1);
                  });
                  clearSelectDragTool();
                },
                dragToolAddChild: (onlyId) => {
                  console.log("drag+child");
                },
                dragToolActive: (onlyId) => {
                  searchLoop(coreForm.value.rule, onlyId, (_, { item }) => {
                    selectDragTool(item);
                  });
                },
              },
              children: [drag],
            },
          ];
          return confRule;
        }

        // 正常设置操作层
        return {
          type: "drag-tool",
          field: dragToolId,
          props: {
            isDrag: config.isDrag !== false,
            isChild: !!config.children,
            isMask: config.isMask,
            onlyId: dragToolId,
          },
          slot: dragToolId,
          on: {
            dragToolAdd: (onlyId) => {
              searchLoop(coreForm.value.rule, onlyId, ({ item, index, ary }) => {
                ary.splice(index + 1, 0, makeRule(item.children[0]._conf));
              });
            },
            dragToolDel: (onlyId) => {
              searchLoop(coreForm.value.rule, onlyId, ({ index, ary }) => {
                ary.splice(index, 1);
              });
              clearSelectDragTool();
            },
            dragToolAddChild: (onlyId) => {
              searchLoop(coreForm.value.rule, onlyId, ({ item, ary }) => {
                const childTag = item.children[0]._conf.children;
                item.children[0].children.push(makeRule(siderMenu.getRule(childTag)));
              });
            },
            dragToolActive: (onlyId) => {
              searchLoop(coreForm.value.rule, onlyId, ({ item }) => {
                selectDragTool(item.children[0]);
              });
            },
          },
          children: [confRule],
        };
      },
      clearSelectDragTool = () => {
        activeKey.value = "form";
        actionRule.activeRule = null;
      },
      selectDragTool = (selectRule) => {
        if (selectRule) {
          activeKey.value = "props";
          actionRule.activeRule = selectRule;

          const baseRules = baseConfig.baseRules(),
            propsRules = actionRule.activeRule._conf.props();
          // 赋值处理
          const propsValue = {};

          baseRules.forEach((item) => {
            if (item.field) {
              propsValue[item.field] =
                actionRule.activeRule[item.field.replace(baseConfig.ruleFieldPrefix, "")];
            }
          });

          propsRules.forEach((item) => {
            if (item.field) {
              propsValue[item.field] = actionRule.activeRule?.props?.[item.field];
            }
          });

          propsForm.value.value = propsValue;
          propsForm.value.rule = [...baseRules, ...propsRules];
        } else {
          actionRule.activeRule = null;
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
        if (actionRule.activeRule) {
          if (field.indexOf(baseConfig.ruleFieldPrefix) === 0) {
            actionRule.activeRule[field.replace(baseConfig.ruleFieldPrefix, "")] = value;
          } else {
            if (!actionRule.activeRule.props) {
              actionRule.activeRule.props = {};
            }
            actionRule.activeRule.props[field] = value;
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
      loadRule = (rules) => {
        let nrs = [];
        rules.forEach((rule) => {
          if (typeof rule === "string") {
            nrs.psuh(rule);
            return;
          }

          const _conf = siderMenu.getRule(rule.type),
            _child = rule.children;
          rule.children = [];

          if (_conf) {
            rule = makeRule(_conf, rule);
            if (_child) {
              let children = rule.children[0].children;
              if (_conf.drag) {
                children = children[0].children;
              }
              children.push(...loadRule(_child));
            }
          } else if (_child) {
            rule.children = loadRule(_child);
          }
          nrs.push(rule);
        });

        return nrs;
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
      setRule = (rules) => {
        coreForm.value.rule = loadRule(
          typeof rules === "string" ? ljc.ruleParse(rules) : rules
        );
      },
      onClick = () => {
        // console.log(coreForm.value.rule);
        // console.log(getRule());
        setRule([
          {
            type: "a-row",
            children: [
              {
                type: "a-col",
                props: {
                  span: 12,
                },
                children: [
                  {
                    field: "a-input1",
                    type: "a-input",
                    title: "输入框",
                    props: {},
                  },
                ],
              },
            ],
            props: {},
          },
          {
            field: "a-select1",
            type: "a-select",
            title: "选择框",
            props: {},
          },
        ]);
      };

    coreForm.value.rule = [makeDrag("draggable", true)];

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
