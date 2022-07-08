import { defineClientConfig } from '@vuepress/client'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import registerComponents from '@temp/register-components'

export default defineClientConfig({
    enhance(enhanceData) {
        debugger;
        registerComponents(enhanceData)
        const { app } = enhanceData
        app.use(antd);
        app.config.globalProperties.$beastForm = {
            base: "ant-design-vue",
        }
    }
})

