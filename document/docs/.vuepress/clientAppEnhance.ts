import { defineClientAppEnhance } from '@vuepress/client'
import JsonLayout from 'json-layout'
import antd from 'ant-design-vue'


export default defineClientAppEnhance(({ app }) => {
    app.use(antd);
    app.component(JsonLayout.name, JsonLayout)
})