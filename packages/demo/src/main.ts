import { createApp } from 'vue'
import App from './app.vue'

import { setBasePropsOption, GlobalConfigType } from 'vue-beast-form';
import { antDesignVue, elementPlus, vant } from "vue-beast-form/esm/config/frameworks.js"

import i18n from './lang/index';

setBasePropsOption({
    // form: {
    //     layout: "vertical",
    // },
    // isI18n: true
})

const app = createApp(App)

const bfConfig: GlobalConfigType = {
    base: 'vant',
    frameworks: {
        ...antDesignVue,
        ...elementPlus,
        ...vant,
    },

}

app.config.globalProperties.$beastForm = bfConfig

app.use(i18n)

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Vant from 'vant';
import 'vant/lib/index.css';

app.use(Antd).directive('test1', {
    mounted() {
        console.log('directive:test1')
    }
})

app.use(ElementPlus)

app.use(Vant)

app.mount('#app')
