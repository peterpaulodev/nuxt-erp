<script setup>
import { sellsColumns } from '@/constants/datatable/columns'
import HeaderSection from '@/pages/components/header-section.vue'
import DataTable from '../components/datatable.vue'

// Define page meta to handle SSR properly
definePageMeta({
  ssr: false, // Disable SSR for this page to avoid hydration issues
})

// Estados reativos
const data = ref([])
const loading = ref(false)
const error = ref(null)
const isClient = ref(false)
const isMounted = ref(false)

// Filtros
const filters = ref({
  status: 'ALL',
  vendedor: 'ALL',
  dataInicio: '',
  dataFim: '',
})

// Opções para filtros
const statusOptions = [
  { value: 'ALL', label: 'Todos os status' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'CONFIRMADA', label: 'Confirmada' },
  { value: 'CANCELADA', label: 'Cancelada' },
  { value: 'ENTREGUE', label: 'Entregue' },
]

const vendedores = ref([])

// Função para buscar vendas
async function fetchVendas() {
  if (!isClient.value) return

  try {
    loading.value = true
    error.value = null

    const response = await $fetch('/api/vendas', {
      query: filters.value,
    })

    data.value = response
  } catch (err) {
    console.error('Erro ao buscar vendas:', err)
    error.value = `Erro ao carregar vendas: ${err.message || 'Erro desconhecido'}`
  } finally {
    loading.value = false
  }
}

// Função para buscar vendedores para o filtro
async function fetchVendedores() {
  if (!isClient.value) return

  try {
    const response = await $fetch('/api/vendedores')
    vendedores.value = [
      { value: 'ALL', label: 'Todos os vendedores' },
      ...response.map((v) => ({ value: v.id, label: v.nome })),
    ]
  } catch (err) {
    console.error('Erro ao buscar vendedores:', err)
  }
}

// Função para aplicar filtros
function applyFilters() {
  fetchVendas()
}

// Função para limpar filtros
function clearFilters() {
  filters.value = {
    status: 'ALL',
    vendedor: 'ALL',
    dataInicio: '',
    dataFim: '',
  }
  fetchVendas()
}

// Função para visualizar detalhes da venda
function viewVenda(venda) {
  navigateTo(`/vendas/${venda.id}`)
}

// Função para nova venda
function goToNewVenda() {
  navigateTo('/vendas/nova')
}

// Carregar dados iniciais
onMounted(async () => {
  await nextTick()
  isClient.value = true
  isMounted.value = true

  // Carregar dados iniciais
  await Promise.all([fetchVendas(), fetchVendedores()])
})
</script>

<template>
  <ClientOnly>
    <div v-if="isMounted" class="flex w-full flex-col gap-6">
      <HeaderSection title="Vendas">
        <template #actions>
          <Button @click="goToNewVenda()">
            <Icon name="i-lucide-plus" class="mr-2" />
            Nova Venda
          </Button>
        </template>
      </HeaderSection>

      <!-- Filtros -->
      <Card class="p-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <Label for="status">Status</Label>
            <Select v-model="filters.status">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="option in statusOptions"
                  :key="`status-${option.value}`"
                  :value="option.value"
                >
                  {{ option.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="vendedor">Vendedor</Label>
            <Select v-model="filters.vendedor">
              <SelectTrigger>
                <SelectValue placeholder="Selecione o vendedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="vendedor in vendedores"
                  :key="`vendedor-${vendedor.value}`"
                  :value="vendedor.value"
                >
                  {{ vendedor.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label for="dataInicio">Data Início</Label>
            <Input id="dataInicio" v-model="filters.dataInicio" type="date" />
          </div>

          <div>
            <Label for="dataFim">Data Fim</Label>
            <Input id="dataFim" v-model="filters.dataFim" type="date" />
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <Button variant="default" @click="applyFilters()">
            <Icon name="i-lucide-search" class="mr-2" />
            Filtrar
          </Button>
          <Button variant="outline" @click="clearFilters()">
            <Icon name="i-lucide-x" class="mr-2" />
            Limpar
          </Button>
        </div>
      </Card>

      <!-- Estado de carregamento -->
      <div v-if="loading" class="flex justify-center py-8">
        <Icon name="i-lucide-loader-2" class="h-6 w-6 animate-spin" />
      </div>

      <!-- Estado de erro -->
      <Alert v-else-if="error" variant="destructive">
        <Icon name="i-lucide-alert-circle" class="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- Tabela de vendas -->
      <DataTable v-else :columns="sellsColumns" :data="data" @row-click="viewVenda" />
    </div>

    <!-- Fallback durante carregamento -->
    <template #fallback>
      <div class="flex w-full flex-col gap-6">
        <div class="flex items-center justify-between">
          <div class="bg-muted h-8 w-32 animate-pulse rounded" />
          <div class="bg-muted h-10 w-28 animate-pulse rounded" />
        </div>
        <div class="bg-muted h-32 w-full animate-pulse rounded" />
        <div class="bg-muted h-64 w-full animate-pulse rounded" />
      </div>
    </template>
  </ClientOnly>
</template>
