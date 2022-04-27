<template>
    <div style="text-align: right;" v-if="!disabled">
        <plus-square-outlined @click="() => onAdd()" />
    </div>
    <a-row v-for="(item, index) in groupRule">
        <a-col flex="auto">
            <json-layout :rule="item.rule" :option="item.option" v-model="value[index]" :disabled="disabled" />
        </a-col>
        <a-col v-if="!disabled">
            <minus-square-outlined @click="() => onDel(index)" />
        </a-col>
    </a-row>
</template>
<script lang="ts">
import { defineComponent, ref, toRefs, getCurrentInstance, watch } from 'vue'
import type { PropType } from 'vue'
import { PlusSquareOutlined, MinusSquareOutlined } from "@ant-design/icons-vue"
import { deepCopy, getParentCompnent } from 'json-layout/lib/tool'
// import JsonLayout from 'json-layout'
// import type { RuleType, PropsOptionType } from 'json-layout/lib/types'
import JsonLayout from '../../../../components'
import type { RuleType, PropsOptionType } from '../../../../components/types'

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
        disabled: { type: Boolean },
        modelValue: { default: null },
        "onUpdate:modelValue": { type: Function },
    },
    setup(props, { emit }) {
        const vm = getCurrentInstance(),
            { rule, option, modelValue, field } = toRefs(props),
            groupRule = ref<GroupRule[]>([]),
            value = ref<Array<any>>([]),
            jApi = ref();

        const onInit = () => {
            // 处理 array['',''] 和 array[object,object]的初始化赋值
            if (modelValue.value) {
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
            }

            // 布局初始化
            if (value.value && value.value.length) {
                value.value.forEach(() => {
                    onAdd(true);
                })
            }
        }, onAdd = (isInit?: boolean) => {
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
        }, resultValue = () => {
            // 处理 array[] 和 array[object]的返回结果
            let result: Array<any> = [];
            if (field.value) {
                value.value.forEach(item => {
                    result.push(item[field.value]);
                })
            } else {
                result = value.value
            }
            return result
        };

        watch(value, () => {
            emit('update:modelValue', resultValue())
        }, {
            deep: true
        });

        onInit();

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