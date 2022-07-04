import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { navbar, sidebar } from './configs'
import { path } from '@vuepress/utils'
import { demoContainer } from '../plugins/demo-container'



export default defineUserConfig({
    lang: 'zh-CN',
    title: 'vue beast form',
    description: '一个通过JSON快速生成 VUE UI 的框架',
    locales: {
        '/zh/': {
            lang: 'zh-CN',
            title: 'vue beast form',
            description: '一个通过JSON快速生成 VUE UI 的框架',
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