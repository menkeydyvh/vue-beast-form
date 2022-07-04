import { defineClientConfig } from '@vuepress/client'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

export default defineClientConfig({
    enhance({ app }) {
        app.config.globalProperties.$beastForm = {
            base: "ant-design-vue",
        }
        app.use(antd);
    }
})