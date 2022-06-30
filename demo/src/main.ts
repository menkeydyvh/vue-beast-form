import { createApp } from 'vue'
import App from './App.vue'

import type { GlobalConfigType } from "../../components"
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';


const app = createApp(App)

const jsonLayoutConfig: GlobalConfigType = {
    base: 'ant-design-vue',
}

app.config.globalProperties.$jsonLayout = jsonLayoutConfig

app.use(Antd).directive('test1', {
    mounted() {
        // console.log('directive:test1')
    }
}).mount('#app')
