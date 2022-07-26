import { createApp } from 'vue'
import App from './App.vue'

import type { GlobalConfigType } from "../../components"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

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
}

app.config.globalProperties.$beastForm = bfConfig

app.use(i18n)

app.use(Antd).directive('test1', {
    mounted() {
        // console.log('directive:test1')
    }
}).mount('#app')
