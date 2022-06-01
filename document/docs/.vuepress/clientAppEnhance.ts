import { defineClientAppEnhance } from '@vuepress/client'
import JsonLayout from 'json-layout'
import antd from 'ant-design-vue'

export default defineClientAppEnhance(({ app }) => {
    app.config.globalProperties.$jsonLayout = {
        base: "ant-design-vue",
    }
    app.use(antd);
    // app.use(JsonLayout)
})