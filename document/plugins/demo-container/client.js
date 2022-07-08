import DemoBlock from './DemoBlock.vue'
import registerComponents from '@temp/register-components'

export default {
  enhance({ app }) {

    registerComponents({ app })
    app.component('DemoBlock', DemoBlock)

  }
} 
