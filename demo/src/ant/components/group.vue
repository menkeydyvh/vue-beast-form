<template>
    <div style="text-align: right;">
        <plus-square-outlined @click="() => onAdd()" />
    </div>
    <a-row v-for="(item, index) in groupRule">
        <a-col flex="auto">
            <json-layout :rule="item.rule" :option="item.option" v-model="value[index]" />
        </a-col>
        <a-col>
            <minus-square-outlined @click="() => onDel(index)" />
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, getCurrentInstance, watch } from 'vue'
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons-vue"
import JsonLayout from 'json-layout'
import { deepCopy, getParentCompnent } from 'json-layout/lib/tool'
import type { PropType } from 'vue'
import type { RuleType, PropsOptionType } from 'json-layout/components/types'

interface GroupRule {
    rule: Array<RuleType>;
    option: PropsOptionType;
}

export default defineComponent({
    name: 'Group',
    components: { JsonLayout, PlusSquareOutlined, MinusSquareOutlined },
    props: {
        field: { type: String },
        rule: { type: Array as PropType<Array<RuleType>>, required: true },
        option: { type: Object as PropType<PropsOptionType> },
        modelValue: { default: null },
        "onUpdate:modelValue": { type: Function },
    },
    setup(props, { emit }) {
        const vm = getCurrentInstance(),
            { rule, option, modelValue, field } = toRefs(props),
            groupRule = ref<GroupRule[]>([]),
            value = ref([]),
            jApi = ref();

        // 处理 array[] 和 array[object]的初始化赋值
        if (field.value) {
            modelValue.value.forEach((item: any) => {
                let json: any = {};
                json[field.value] = item;
                value.value.push(json)
            })
        } else {
            if (modelValue.value) {
                value.value = modelValue.value
            }
        }

        const onAdd = (isInit?: boolean) => {
            // 添加
            let ruleItem = deepCopy(rule.value), optionItem = null;
            if (option.value) {
                optionItem = deepCopy(option.value)
            } else {
                const parent = getParentCompnent(vm.parent, JsonLayout.name);
                if (parent) {
                    const parentOption = parent.props.option as PropsOptionType;
                    if (parentOption) {
                        optionItem = deepCopy(parentOption)
                    }
                }
            }
            groupRule.value.push({
                rule: ruleItem,
                option: optionItem,
            })
            if (!isInit) {
                value.value.push({})
            }
        }, onDel = (index: number) => {
            // 删除
            groupRule.value.splice(index, 1)
            value.value.splice(index, 1)
        }

        if (value.value) {
            value.value.forEach(() => {
                onAdd(true);
            })
        }

        watch(value, () => {
            // 处理 array[] 和 array[object]的返回结果
            let resultValue: any = [];
            if (field.value) {
                value.value.forEach(item => {
                    resultValue.push(item[field.value]);
                })
            } else {
                resultValue = value.value
            }
            emit('update:modelValue', resultValue)
        }, {
            deep: true
        });

        return {
            jApi,
            value,
            groupRule,
            onAdd,
            onDel,
        }
    }
})

</script>