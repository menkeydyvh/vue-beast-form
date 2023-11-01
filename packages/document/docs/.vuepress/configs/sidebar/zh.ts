import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/zh/': [
    {
      text: '指南',
      children: [
        '/zh/guide/install.md',
        '/zh/guide/started.md',
        '/zh/guide/demo.md',
        '/zh/guide/demandLoad.md',
        '/zh/guide/ts.md',
      ],
    },
    {
      text: '全局配置',
      children: [
        '/zh/global/beastForm.md',
        '/zh/global/i18n.md',
        '/zh/global/api.md',
      ],
    },
    {
      text: 'beast-form',
      children: [
        '/zh/props/index.md',
        '/zh/props/rule.md',
        '/zh/props/api.md',
        '/zh/props/option.md',
      ],
    }, 
    {
      text: '其他组件',
      children: [
        '/zh/compoments/custom.md',
        '/zh/compoments/object.md',
        '/zh/compoments/array.md',
      ],
    }, 
    {
      text: '框架配置',
      children: [
        "/zh/frameworks/antDesignVue.md",
        "/zh/frameworks/elementPuls.md",
        "/zh/frameworks/vant.md",
      ]
    }
  ],
}
