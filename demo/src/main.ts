import { createApp } from 'vue'
import App from './App.vue'

import Antd, { InputNumber, Input } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

createApp(App).use(Antd).directive('test1', {
    mounted() {
        console.log('directive:test1')
    }
}).mount('#app')
