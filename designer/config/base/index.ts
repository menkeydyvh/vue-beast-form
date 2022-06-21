import type { RuleType } from "../../../components/types/rule"

export default class Base {

    constructor() {
    }
    /**
     * 基础的规则
     * @returns 
     */
    baseRules() {
        return [
            {
                type: 'a-input',
                field: 'field',
                title: 'field',
            }, {
                type: 'a-input',
                field: 'title',
                title: 'title',
            }, {
                type: 'a-input',
                field: 'info',
                title: 'info',
            }, {
                type: 'a-input',
                field: 'class',
                title: 'class',
            },

        ]
    }
    /**
     * form的配置
     * @returns 
     */
    formPropsRules() {
        return [
            {
                type: 'a-radio-group',
                field: 'layout',
                value: 'vertical',
                title: '表单布局',
                props: {
                    options: [
                        { value: 'horizontal', label: 'horizontal' },
                        { value: 'vertical', label: 'vertical' },
                        { value: 'inline', label: 'inline' },
                    ]
                }
            },
            {
                type: 'a-radio-group',
                field: 'labelAlign',
                value: 'right',
                title: '标签的文本对齐方式',
                props: {
                    options: [
                        { value: 'right', label: 'right' },
                        { value: 'left', label: 'left' },
                    ]
                }
            },
            {
                type: 'a-switch',
                field: 'hideRequiredMark',
                value: false,
                title: '隐藏所有表单项的必选标记',
            },

        ]
    }
};