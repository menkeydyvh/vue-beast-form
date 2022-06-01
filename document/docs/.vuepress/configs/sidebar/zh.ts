import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/zh/': [
    {
      text: '指南',
      children: [
        '/zh/guide/install.md',
        '/zh/guide/started.md',
        '/zh/guide/demo.md',
        '/zh/guide/config.md',
      ],
    },
    {
      text: '参数说明',
      children: [
        '/zh/props/rule.md',
        '/zh/props/api.md',
      ],
    },
    {
      text: '细节教程',
      children: [
      ],
    },
  ],
}
