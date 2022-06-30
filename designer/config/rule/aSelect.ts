import type { ConfigRuleType } from "../../types/rule"

let uuid = 0;
const label = '选择框';
const name = 'a-select';
const tag = 'form';

const config: ConfigRuleType = {
    label,
    name,
    tag,
    rule() {
        return {
            field: `${name}${++uuid}`,
            type: name,
            title: label,
        };
    },
    props() {
        return [
            {
                type: "a-divider",
                children: ["Props配置"],
            },
            { type: 'a-input', field: 'placeholder', title: '输入框占位文本' },
            { type: 'a-switch', field: 'allowClear', title: '是否可清空' },
        ];
    }
}

export default config;