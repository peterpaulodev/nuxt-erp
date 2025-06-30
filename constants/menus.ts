import type { NavMenu, NavMenuItems } from '~/types/nav'

export const navMenu: NavMenu[] = [
  {
    heading: 'Geral',
    items: [
      {
        title: 'Dashboard',
        icon: 'i-lucide-home',
        link: '/',
      },
    ],
  },
  {
    heading: 'Pages',
    items: [
      {
        title: 'Vendedores',
        icon: 'i-lucide-user',
        link: '/vendedores',
      },
      {
        title: 'Produtos',
        icon: 'i-lucide-package',
        link: '/produtos',
      },
      {
        title: 'Vendas',
        icon: 'i-lucide-banknote',
        link: '/vendas',
      },
    ],
  },
]

export const navMenuBottom: NavMenuItems = [
  {
    title: 'Help & Support',
    icon: 'i-lucide-circle-help',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
  {
    title: 'Feedback',
    icon: 'i-lucide-send',
    link: 'https://github.com/dianprata/nuxt-shadcn-dashboard',
  },
]
