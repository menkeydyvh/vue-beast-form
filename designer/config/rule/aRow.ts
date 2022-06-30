import type { ConfigRuleType } from "../../types/rule"

const label = '栅格布局';
const name = 'a-row';
const tag = 'layout';

const config: ConfigRuleType = {
    label,
    name,
    tag,
    children: 'a-col',
    rule() {
        return {
            type: name,
            children: []
        };
    },
    props() {
        return [
            {
                type: "a-divider",
                children: ["Props配置"],
            },
            { type: 'a-input-number', field: 'gutter', title: '栅格间隔' },
            { type: 'a-switch', field: 'wrap', title: '是否自动换行', value: false },
            {
                type: 'a-select', field: 'align', title: 'flex 布局下的垂直对齐方式',
                value: "top",
                props: {
                    option: [
                        { value: "top", label: "top" },
                        { value: "middle", label: "middle" },
                        { value: "bottom", label: "bottom" },
                    ]
                }
            },
            {
                type: 'a-select', field: 'align', title: 'flex 布局下的水平排列方式',
                value: "start",
                props: {
                    option: [
                        { value: "start", label: "start" },
                        { value: "end", label: "end" },
                        { value: "center", label: "center" },
                        { value: "space-around", label: "space-around" },
                        { value: "space-between", label: "space-between" },
                    ]
                }
            },
        ];
    }
}

export default config;