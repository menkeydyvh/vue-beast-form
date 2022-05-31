import { defineClientAppEnhance } from '@vuepress/client'
import antd from 'ant-design-vue'


export default defineClientAppEnhance(({ app }) => {
    app.use(antd);
    app.config.globalProperties.$jsonLayout = {
        base: "ant-design-vue",
    }
})