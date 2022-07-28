import { createApp } from 'vue'
import App from './app.vue'

import type { GlobalConfigType } from "../../components"

import i18n from './lang/index';
import vbf from '../../components';

vbf.setBasePropsOption({
    form: {
        layout: "vertical",
    },
    // isI18n: true
})

const app = createApp(App)

const bfConfig: GlobalConfigType = {
    base: 'ant-design-vue',
    frameworks: ['ant-design-vue', 'element-plus']
}

app.config.globalProperties.$beastForm = bfConfig

app.use(i18n)

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

app.use(Antd).directive('test1', {
    mounted() {
        // console.log('directive:test1')
    }
})

app.use(ElementPlus)

app.mount('#app')
