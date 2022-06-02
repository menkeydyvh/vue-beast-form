import { defineClientAppEnhance } from '@vuepress/client'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

export default defineClientAppEnhance(({ app }) => {
    app.config.globalProperties.$jsonLayout = {
        base: "ant-design-vue",
    }
    app.use(antd);
})