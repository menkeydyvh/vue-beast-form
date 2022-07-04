import { defineClientConfig } from '@vuepress/client'
import DemoBlock from './demoBlock.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component("DemoBlock", DemoBlock)
  }
})