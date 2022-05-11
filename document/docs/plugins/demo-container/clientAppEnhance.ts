import { defineClientAppEnhance } from '@vuepress/client'
import DemoBlock from './demoBlock.vue'

export default defineClientAppEnhance(({ app, }) => {
  app.component(DemoBlock.name, DemoBlock)
})