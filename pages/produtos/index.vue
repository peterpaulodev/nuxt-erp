<script setup>
import { productsColumns } from '@/constants/datatable/columns/products'
import HeaderSection from '@/pages/components/header-section.vue'
import DataTable from '../components/datatable.vue'

const products = [
  {
    id: 1,
    name: 'Smartphone Samsung Galaxy S23',
    price: 2499.99,
    active: true,
  },
  {
    id: 2,
    name: 'Notebook Dell Inspiron 15',
    price: 3299.90,
    active: true,
  },
  {
    id: 3,
    name: 'Fone de Ouvido Sony WH-1000XM4',
    price: 899.99,
    active: false,
  },
  {
    id: 4,
    name: 'Tablet Apple iPad Air',
    price: 4199.00,
    active: true,
  },
  {
    id: 5,
    name: 'Smartwatch Apple Watch Series 8',
    price: 2799.99,
    active: true,
  },
  {
    id: 6,
    name: 'Câmera Canon EOS R6',
    price: 8999.99,
    active: false,
  },
  {
    id: 7,
    name: 'Monitor LG UltraWide 34"',
    price: 1899.90,
    active: true,
  },
  {
    id: 8,
    name: 'Teclado Mecânico Logitech MX',
    price: 599.99,
    active: true,
  },
]

function goTonewProductPage() {
  navigateTo('/produtos/novo')
}

const data = ref([])

async function getData() {
  return products
}

onMounted(async () => {
  data.value = await getData()
})
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <HeaderSection title="Produtos">
      <template #actions>
        <Button @click="goTonewProductPage()">
          <Icon name="lucide:plus" class="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </template>
    </HeaderSection>
    <Card class="rounded-2xl p-4 shadow-sm">
      <CardContent>
        <DataTable :columns="productsColumns" :data="data" />
      </CardContent>
    </Card>
  </div>
</template>
