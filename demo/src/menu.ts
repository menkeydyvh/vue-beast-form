
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
]

export default menu