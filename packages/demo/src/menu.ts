
export interface MenuItem {
    title: string;
    base?: string;
    component?: any;
    children?: MenuItem[];
}

const menu: MenuItem[] = [
    {
        title: "ant-design-vue",
        base: "ant",
        children: [
            {
                title: "示例表单",
                component: "sample.vue",
            },
            {
                title: "简易表单",
                component: "easyForm.vue",
            },
            {
                title: "FormItem-Label",
                component: "formItemLabel.vue",
            },
            {
                title: "Object",
                component: "objectForm.vue",
            },
            {
                title: "Group",
                component: "groupForm.vue",
            },
            {
                title: "Upload",
                component: "uploadForm.vue",
            },
            {
                title: "其他v-model组件",
                component: "otherModel.vue",
            },
            {
                title: "ApiTest",
                component: "apiForm.vue",
            },
            {
                title: "getApi测试",
                component: "getApi.vue",
            },
        ],
    },
    {
        title: "elememt-plus",
        base: "elememtPlus",
        children: [
            {
                title: "示例表单",
                component: "sample.vue",
            },
            {
                title: "简易表单",
                component: "easyForm.vue",
            },
        ],
    },
    {
        title: "vant",
        base: "vant",
        children: [
            {
                title: "示例表单",
                component: "sample.vue",
            }, {
                title: "简易表单",
                component: "easyForm.vue",
            },
        ],
    },
    {
        title: "vuedraggable",
        base: "vuedraggable",
        children: [
            {
                title: "示例",
                component: "index.vue",
            },
        ],
    },
    {
        title: "test",
        base: "test",
        children: [
            {
                title: "示例",
                component: "index.vue",
            },
        ],
    },
]

export default menu