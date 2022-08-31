<template>
  <div style="text-align: right" v-if="!disabled">
    <plus-square-outlined @click="() => onAdd()" />
  </div>
  <a-row v-for="(item, index) in groupRule">
    <a-col flex="auto">
      <beast-form
        v-model:api="fapis[index]"
        v-model="value[index]"
        :rule="item.rule"
        :option="item.option"
        :disabled="disabled"
      />
    </a-col>
    <a-col v-if="!disabled">
      <minus-square-outlined @click="() => onDel(index)" />
    </a-col>
  </a-row>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, watch } from "vue";
import type { PropType } from "vue";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons-vue";
import vbf from "../../../../components";
import { deepCopy } from "../../../../components/tool";
import type { RuleType, PropsOptionType, ApiType } from "../../../../components";

interface GroupRule {
  rule: RuleType[];
  option: PropsOptionType;
}

vbf.useFramework("ant-design-vue");

export default defineComponent({
  name: "Group",
  components: { BeastForm: vbf.beastForm(), PlusSquareOutlined, MinusSquareOutlined },
  props: {
    field: { type: String },
    rule: { type: Array as PropType<RuleType[]>, required: true },
    option: { type: Object as PropType<PropsOptionType> },
    disabled: { type: Boolean },
    modelValue: { default: null },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const { rule, option, modelValue, field } = toRefs(props),
      groupRule = ref<GroupRule[]>([]),
      value = ref<any[]>([]),
      fapis = ref<ApiType[]>([]);

    const onInit = () => {
        // 处理 array['',''] 和 array[object,object]的初始化赋值
        if (modelValue.value) {
          if (field.value) {
            modelValue.value.forEach((item: any) => {
              let json: any = {};
              json[field.value] = item;
              value.value.push(json);
            });
          } else {
            value.value = modelValue.value;
          }
        }

        // 布局初始化
        if (value.value && value.value.length) {
          value.value.forEach(() => {
            onAdd(true);
          });
        }
      },
      onAdd = (isInit?: boolean) => {
        // 添加
        let ruleItem = deepCopy(rule.value),
          optionItem = null;
        if (option.value) {
          optionItem = deepCopy(option.value);
        }
        groupRule.value.push({
          rule: ruleItem,
          option: optionItem,
        });
        if (!isInit) {
          value.value.push({});
        }
      },
      onDel = (index: number) => {
        // 删除
        groupRule.value.splice(index, 1);
        value.value.splice(index, 1);
        fapis.value.splice(index, 1);
      },
      resultValue = () => {
        // 处理 array[] 和 array[object]的返回结果
        let result: any[] = [];
        if (field.value) {
          value.value.forEach((item) => {
            result.push(item[field.value]);
          });
        } else {
          result = value.value;
        }
        return result;
      };

    watch(
      value,
      () => {
        emit("update:modelValue", resultValue());
      },
      {
        deep: true,
      }
    );

    onInit();

    return {
      fapis,
      value,
      groupRule,
      onAdd,
      onDel,
    };
  },
});
</script>
