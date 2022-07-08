import { defineClientConfig } from '@vuepress/client'
import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import DemoBlock from '../plugins/demo-container/DemoBlock.vue'

export default defineClientConfig({
    enhance({ app }) {
        app.config.globalProperties.$beastForm = {
            base: "ant-design-vue",
        }
        app.component("DemoBlock", DemoBlock)
        app.use(antd);
    }
})