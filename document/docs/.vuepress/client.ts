import { defineClientConfig } from '@vuepress/client'

import frameworks from 'vue-beast-form/lib/config/frameworks'

import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

export default defineClientConfig({
    enhance({ app }) {
        app.config.globalProperties.$beastForm = {
            base: "ant-design-vue",
            frameworks: frameworks
        }
        app.use(antd);
    }
})

