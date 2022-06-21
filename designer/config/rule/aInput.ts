import type { RuleType } from "../../types/rule"

const label = '输入框';
const name = 'a-input';
const tag = 'form';

const config: RuleType = {
    label,
    name,
    tag,
    rule() {
        return {
            type: name,
            title: label,
        };
    },
    props() {
        return [
            { type: 'a-input', field: 'placeholder', title: '输入框占位文本' },
            { type: 'a-switch', field: 'allowClear', title: '是否可清空' },
        ];
    }
}

export default config;