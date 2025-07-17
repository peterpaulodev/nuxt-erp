import { Avatar } from '@/components/ui/avatar'
import { h } from 'vue'

export const sellersColumns = [
  {
    accessorKey: 'avatar',
    header: 'Usuário',
    cell: ({ row }) => {
      return h(
        Avatar,
        { class: 'lowercase', src: row.getValue('avatar') },
        row.getValue('avatar'),
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    },
  },
]
