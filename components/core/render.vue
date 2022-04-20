<template>
    <template v-if="Array.isArray(rule)">
        <template v-for="ruleItem in rule">
            <component :is="ruleItem.type" v-bind="ruleItem.props">
                <rule-render v-if="ruleItem.children" :rule="ruleItem.children" />
            </component>
        </template>
    </template>
    <template v-else>
        <component :is="rule.type" v-bind="rule.props">
            <rule-render v-if="rule.children" :rule="rule.children" />
        </component>
    </template>
</template>
<script>
/**
 * TODO：不知道函数渲染快还是模板渲染快  如果模板渲染快再来完善这个组件先使用函数渲染
 * 还未完善
 */
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ruleRender',
    props: ['rule']
});
</script>