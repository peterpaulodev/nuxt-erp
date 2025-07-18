import ActionsCell from '@/components/datatable/cells/ActionsCell.vue'
import PriceCell from '@/components/datatable/cells/PriceCell.vue'
import StatusCell from '@/components/datatable/cells/StatusCell.vue'

import { h } from 'vue'

export const productsColumns = [
  {
    accessorKey: 'name',
    header: 'Nome',
    cell: ({ row }) => {
      return h('div', { class: 'font-medium' }, row.getValue('name'))
    },
  },
  {
    accessorKey: 'price',
    header: 'Preço',
    cell: ({ row }) => {
      return h(PriceCell, { value: row.getValue('price') })
    },
  },
  {
    accessorKey: 'active',
    header: 'Ativo',
    cell: ({ row }) => {
      return h(StatusCell, { isActive: row.getValue('active') })
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Ações'),
    cell: ({ row }) => {
      const product = row.original
      return h(ActionsCell, {
        item: product,
        onEdit: product => {
          navigateTo(`/produtos/${product.id}/editar`)
        },
        onDelete: product => {
          console.warn('Deletar produto:', product)
          // Aqui você pode implementar a lógica de exclusão
          // Exemplo: await deleteProduct(product.id)
        },
      })
    },
  },
]
