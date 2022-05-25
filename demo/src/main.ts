import { createApp } from 'vue'
import App from './App.vue'

import Antd, { InputNumber, Input } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
const app = createApp(App)

app.config.globalProperties.$formBeast = {
    baseUi: 'ant-design-vue'
}

app.use(Antd).directive('test1', {
    mounted() {
        console.log('directive:test1')
    }
}).mount('#app')
