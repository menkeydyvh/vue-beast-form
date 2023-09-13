import { defineClientConfig } from '@vuepress/client'

import { antDesignVue, elementPlus, vant } from 'vue-beast-form/lib/config/frameworks'

import antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Vant from 'vant';
import 'vant/lib/index.css';

export default defineClientConfig({
    enhance({ app }) {
        app.config.globalProperties.$beastForm = {
            base: "ant-design-vue",
            frameworks: { ...antDesignVue, ...elementPlus, ...vant }
        }
        app.use(antd);
        app.use(ElementPlus)
        app.use(Vant)
    }
})

