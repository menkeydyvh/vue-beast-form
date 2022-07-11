import DemoBlock from './DemoBlock.vue'
import registerComponents from '@temp/register-components'

export default {
  enhance({ app }) {
    app.component('DemoBlock', DemoBlock)

    registerComponents({ app })

  }
} 
