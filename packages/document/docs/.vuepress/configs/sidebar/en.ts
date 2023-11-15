import type { SidebarConfig } from '@vuepress/theme-default'

export const en: SidebarConfig = {
  '/zh/guide/': [
    {
      text: 'Guide',
      children: [
        '/en/guide/install.md',
      ],
    },
  ],
}
