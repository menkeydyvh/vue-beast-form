import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { navbar, sidebar } from './configs'

console.log(navbar)
export default defineUserConfig({
    lang: 'zh-CN',
    title: 'JsonLayout',
    description: '一个通过JSON快速生成 VUE UI 的框架',
    locales: {
        // '/en/': {
        //     lang: 'en-US',
        //     title: 'JsonLayout',
        //     description: 'A framework for quickly generating VUE UI from JSON',
        // },
        '/zh/': {
            lang: 'zh-CN',
            title: 'JsonLayout',
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
    })
})