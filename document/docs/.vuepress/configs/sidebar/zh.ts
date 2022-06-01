import type { SidebarConfig } from '@vuepress/theme-default'

export const zh: SidebarConfig = {
  '/zh/guide/': [
    {
      text: '指南',
      children: [
        '/zh/guide/install.md',
        '/zh/guide/started.md',
        '/zh/guide/config.md',
      ],
    },
    {
      text: 'Props',
      children: [
        '/zh/guide/rule.md',
      ],
    },
  ],
}
