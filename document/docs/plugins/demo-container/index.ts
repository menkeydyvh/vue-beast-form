/**
 * ::: demo xxx ::: 语法，用于构建 markdown 中的示例
 */
import type { Plugin, PluginObject } from '@vuepress/core'

import demoBlockContainers from "./common/containers"
import { hash, path } from '@vuepress/utils'
import prepareClientAppEnhanceFile from './prepareClientAppEnhanceFile'
import chokidar from 'chokidar'

interface OptionsType {
  componentsDir: string
  components?: any
  componentsPatterns?: string[]
  getComponentName?: any
}

export const demoContainer = (options: OptionsType): Plugin => {
  options = {
    components: {},
    componentsPatterns: ['**/*.vue'],
    getComponentName: (filename: string) => path.trimExt(filename.replace(/\/|\\/g, '-')),
    ...options,
  }

  const optionsHash = hash(options)
  const { componentsDir, componentsPatterns } = options

  const plugin: PluginObject = {
    name: 'vuepress-plugin-demo-container',
    clientAppEnhanceFiles: (app) => prepareClientAppEnhanceFile(app, options, optionsHash),

    extendsMarkdown: (md) => {
      md.use(demoBlockContainers(options))
    },

    onWatched: (app, watchers) => {
      if (componentsDir) {
        const componentsWatcher = chokidar.watch(componentsPatterns as string[], {
          cwd: componentsDir,
          ignoreInitial: true,
        })
        componentsWatcher.on('add', () => {
          prepareClientAppEnhanceFile(app, options, optionsHash)
        })
        componentsWatcher.on('unlink', () => {
          prepareClientAppEnhanceFile(app, options, optionsHash)
        })
        watchers.push(componentsWatcher)
      }
    },
  }

  return plugin
}


export default {
  demoContainer
}