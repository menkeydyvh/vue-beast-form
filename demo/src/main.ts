import { createApp } from 'vue'
import App from './App.vue'

import type { ConfigOptionsType } from "../../components/types"
import Antd, { InputNumber, Input } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';


const app = createApp(App)

const jsonLayout: ConfigOptionsType = {
    baseUi: 'ant-design-vue'
}

app.config.globalProperties.$jsonLayout = jsonLayout

app.use(Antd).directive('test1', {
    mounted() {
        console.log('directive:test1')
    }
}).mount('#app')
