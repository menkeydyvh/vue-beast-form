import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { navbar, sidebar } from './configs'
import { path } from '@vuepress/utils'
import demoContainer from '../../plugins/demo-container'

export default defineUserConfig({
    lang: 'zh-CN',
    title: 'vue beast form',
    description: '通过JSON配置UI来实现Vue的渲染的框架',
    locales: {
        '/zh/': {
            lang: 'zh-CN',
            title: 'vue beast form',
            description: '通过JSON配置UI来实现Vue的渲染的框架',
        },
    },
    theme: defaultTheme({
        locales: {
            '/zh/': {
                navbar: navbar.zh,
                sidebar: sidebar.zh,
            }
        }
    }),
    plugins: [
        demoContainer({
            componentsDir: path.resolve(__dirname, '../examples')
        })
    ]
})