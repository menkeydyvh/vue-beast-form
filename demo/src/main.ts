import { createApp } from 'vue'
import App from './app.vue'

import type { GlobalConfigType } from "../../components"

import i18n from './lang/index';
import vbf from '../../components';

vbf.setBasePropsOption({
    // form: {
    //     layout: "vertical",
    // },
    // isI18n: true
})

const app = createApp(App)

const bfConfig: GlobalConfigType = {
    base: 'vant',
    frameworks: ['ant-design-vue', 'element-plus', 'vant'],
    defaultName: {
        form: 'van-form',
        formItem: '',
        formItemPropName: '',
        formItemPropLabel: '',
        formItemPropRules: '',
        formItemSlotTitle: '',
        formEventValidate: 'validate',
        formEventClearValidate: 'resetValidation',
    },
    formDataComponentKey: {
        "van-calendar": 'show',
        "van-popup": 'show',
    },
    formDataComponentDefaultValue: {
        "van-checkbox-group": [],
        "van-number-keyboard": ''
    }
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
        // console.log('directive:test1')
    }
})

app.use(ElementPlus)

app.use(Vant)

app.mount('#app')
