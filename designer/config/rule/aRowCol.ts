import type { ConfigRuleType } from "../../types/rule"

const label = '栅格布局Col';
const name = 'a-col';
const tag = 'layout';

const config: ConfigRuleType = {
    label,
    name,
    tag,
    drag: true,
    isDrag: false,
    showMenu: false,
    rule() {
        return {
            type: name,
            props: { span: 12 },
            children: []
        };
    },
    props() {
        return [
            {
                type: "a-divider",
                children: ["Props配置"],
            },
            {
                type: 'a-slider', field: 'span', props: {
                    min: 0,
                    max: 24,
                }, title: '栅格占位格数'
            },
            { type: 'a-input', field: 'flex', title: 'flex 布局填充' },
            { type: 'a-input-number', field: 'offset', title: '栅格左侧的间隔格数' },
            { type: 'a-input-number', field: 'pull', title: '栅格向左移动格数' },
            { type: 'a-input-number', field: 'push', title: '栅格向右移动格数' },
            { type: 'a-input-number', field: 'order', title: '栅格顺序，flex下有效' },

        ];
    }
}

export default config;