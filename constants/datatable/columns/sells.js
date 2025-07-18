import ActionsCell from '@/components/datatable/cells/ActionsCell.vue'
import { Badge } from '@/components/ui/badge'
import { h } from 'vue'

export const sellsColumns = [
  {
    accessorKey: 'numero',
    header: 'Número',
    cell: ({ row }) => {
      return h('div', { class: 'font-medium' }, row.getValue('numero'))
    },
  },
  {
    accessorKey: 'vendedor',
    header: 'Vendedor',
    cell: ({ row }) => {
      const vendedor = row.getValue('vendedor')
      return h('div', { class: 'font-medium' }, vendedor?.nome || 'N/A')
    },
  },
  {
    accessorKey: 'valorTotal',
    header: () => h('div', { class: '' }, 'Valor Total'),
    cell: ({ row }) => {
      const valor = Number.parseFloat(row.getValue('valorTotal'))
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor)

      return h('div', { class: 'font-medium' }, formatted)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      const statusConfig = {
        PENDENTE: { variant: 'secondary', label: 'Pendente' },
        CONFIRMADA: { variant: 'default', label: 'Confirmada' },
        CANCELADA: { variant: 'destructive', label: 'Cancelada' },
        ENTREGUE: { variant: 'outline', label: 'Entregue' },
      }

      const config = statusConfig[status] || { variant: 'secondary', label: status }

      return h(Badge, { variant: config.variant }, () => config.label)
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Data',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return h('div', { class: 'text-sm' }, date.toLocaleDateString('pt-BR'))
    },
  },
  {
    accessorKey: 'pagamentos',
    header: 'Pagamento',
    cell: ({ row }) => {
      const pagamentos = row.getValue('pagamentos') || []
      const pagamento = pagamentos[0] // Primeiro pagamento

      if (!pagamento) {
        return h('div', { class: 'text-sm text-muted-foreground' }, 'N/A')
      }

      const statusConfig = {
        PENDENTE: { variant: 'secondary', label: 'Pendente' },
        PAGO: { variant: 'default', label: 'Pago' },
        CANCELADO: { variant: 'destructive', label: 'Cancelado' },
        ESTORNADO: { variant: 'outline', label: 'Estornado' },
      }

      const config = statusConfig[pagamento.status] || {
        variant: 'secondary',
        label: pagamento.status,
      }

      return h('div', { class: 'flex flex-col gap-1' }, [
        h('div', { class: 'text-sm' }, pagamento.formaPagamento.replace('_', ' ')),
        h(Badge, { variant: config.variant, class: 'w-fit' }, () => config.label),
      ])
    },
  },
  {
    id: 'actions',
    header: () => h('div', { class: 'text-right' }, 'Ações'),
    cell: ({ row }) => {
      const product = row.original
      return h(ActionsCell, {
        item: product,
        hasDelete: false,
        onEdit: (product) => {
          navigateTo(`/vendas/${product.id}/editar`)
        },
      })
    },
  },
]
