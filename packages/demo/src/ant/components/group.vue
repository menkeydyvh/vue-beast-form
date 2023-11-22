<template>
  <div style="text-align: right" v-if="!disabled">
    <plus-square-outlined @click="() => onAdd()" />
  </div>
  <a-row v-for="(item, index) in groupRule">
    <a-col flex="auto">
      <BeastForm v-model:api="groupApi[index]" v-model="groupValue[index]" :rule="item" :option="option"
        :disabled="disabled" />
    </a-col>
    <a-col v-if="!disabled">
      <minus-square-outlined @click="() => onDel(index)" />
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { defineOptions, ref, watch } from "vue";
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons-vue";
import { deepCopy } from "vue-beast-form/esm/tool";
import { BeastForm, RuleType, ApiType, PropsOptionType } from "vue-beast-form";

interface GroupProps {
  rule: RuleType | RuleType[];
  option?: PropsOptionType;
  field?: string;
  disabled?: boolean;
  modelValue?: any[];
}

defineOptions({
  name: "Group",
})
const props = defineProps<GroupProps>();
const emit = defineEmits(["update:modelValue"])

const groupRule = ref<RuleType[][]>([]);
const groupValue = ref<Record<string, any>[]>([]);
const groupApi = ref<ApiType[]>([]);

const onAdd = (isInit?: boolean) => {
  const copyRule = deepCopy(props.rule);
  if (Array.isArray(copyRule)) {
    groupRule.value.push(copyRule);
  } else {
    groupRule.value.push([copyRule]);
  }
  if (!isInit) {
    groupValue.value.push(null);
  }
  groupApi.value.push(null);
}

const onDel = (index: number) => {
  groupRule.value.splice(index, 1);
  groupValue.value.splice(index, 1);
  groupApi.value.splice(index, 1);
}


if (props.modelValue) {
  if (props.field) {
    props.modelValue.forEach((item: any) => {
      groupValue.value.push({
        [props.field]: item
      });
    });
  } else {
    groupValue.value = [...props.modelValue];
  }
}
if (groupValue.value?.length) {
  groupValue.value.forEach(() => {
    onAdd(true);
  });
}

watch(groupValue, () => {
  // 处理 array[] 和 array[object]的返回结果
  const result: any[] = [];
  if (props.field) {
    groupValue.value.forEach((item) => {
      result.push(item?.[props.field]);
    });
  } else {
    result.push(...groupValue.value);
  }
  emit('update:modelValue', result)
}, { deep: true })
</script>
