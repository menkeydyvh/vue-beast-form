import { globby, path } from '@vuepress/utils'
import DemoBlock from './demoBlock'

export default async (app, options, identifier = '') => {
    app.component("DemoBlock", DemoBlock)

    const getComponentsFromDir = async ({ componentsDir, componentsPatterns, getComponentName }) => {
        if (!componentsDir) {
            return {}
        }
        // get all matched component files
        const componentsDirFiles = await globby(componentsPatterns, {
            cwd: componentsDir,
        })
        // transform files to name => filepath map
        return Object.fromEntries(
            componentsDirFiles.map((filename) => [
                getComponentName(filename),
                path.resolve(componentsDir, filename),
            ])
        )
    }

    const componentsFromDir = await getComponentsFromDir(options)

    const componentsMap = {
        ...componentsFromDir,
        ...options.components,
        DemoBlock,
    }
    const content = `\
    import { defineAsyncComponent } from 'vue'
    
    export default ({ app }) => {\
    ${Object.entries(componentsMap).map(
        ([name, filepath]) => `
      app.component(${JSON.stringify(
            name
        )}, defineAsyncComponent(() => import(${JSON.stringify(filepath)})))`
    )}
    }
    `
    console.log("writeTemp:", identifier)
    // write temp file and return the file path
    return app.writeTemp(
        `register-components/client.${identifier}.js`,
        content
    )
}