/*
 * 参考大佬: 曹捷进行修改只在当前文档内使用
 */
/**
 * 提供 ::: demo xxx ::: 语法，用于构建 markdown 中的示例
 */
const demoBlockContainers = require('./common/containers')
const { hash, path } = require('@vuepress/utils')
const prepareClient = require('./prepareClient')
const chokidar = require('chokidar')

module.exports = (options = {}) => {

  options = Object.assign({
    components: {},
    componentsDir: null,
    componentsPatterns: ['**/*.vue', "*.vue"],
    getComponentName: (filename) => path.trimExt(filename.replace(/\/|\\/g, '-'))
  }, options)

  const optionsHash = hash(options)
  const { componentsDir, componentsPatterns } = options
  return {
    name: 'vuepress-plugin-demo-container',
    clientConfigFile: path.join(__dirname, './client.js'),
    onPrepared: (app) =>
      prepareClient(app, options, optionsHash),
    extendsMarkdown: md => {
      md.use(demoBlockContainers(options))
    },
    onWatched: (app, watchers) => {
      if (componentsDir) {
        const componentsWatcher = chokidar.watch(componentsPatterns, {
          cwd: componentsDir,
          ignoreInitial: true,
        })
        componentsWatcher.on('add', () => {
          prepareClient(app, options, optionsHash)
        })
        componentsWatcher.on('unlink', () => {
          prepareClient(app, options, optionsHash)
        })
        watchers.push(componentsWatcher)
      }
    },
  }
}