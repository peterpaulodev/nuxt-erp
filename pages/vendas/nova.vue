<script setup>
  import HeaderSection from '@/pages/components/header-section.vue'

  // Define page meta to handle SSR properly
  definePageMeta({
    ssr: false, // Disable SSR for this page to avoid hydration issues
  })

  // Estados reativos
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)
  const isClient = ref(false)
  const isMounted = ref(false)

  // Dados do formulário
  const formData = ref({
    vendedorId: '',
    desconto: 0,
    observacoes: '',
    itens: [
      {
        produtoId: '',
        quantidade: 1,
        precoUnit: 0,
      },
    ],
    pagamentos: [
      {
        valor: 0,
        formaPagamento: 'DINHEIRO',
        dataVencimento: '',
        observacoes: '',
      },
    ],
  })

  // Dados para selects
  const vendedores = ref([])
  const produtos = ref([])

  // Opções para formas de pagamento
  const formasPagamento = [
    { value: 'DINHEIRO', label: 'Dinheiro' },
    { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
    { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
    { value: 'PIX', label: 'PIX' },
    { value: 'TRANSFERENCIA', label: 'Transferência' },
    { value: 'CHEQUE', label: 'Cheque' },
  ]

  // Computed values
  const valorTotalItens = computed(() => {
    return formData.value.itens.reduce((total, item) => {
      return total + item.quantidade * item.precoUnit
    }, 0)
  })

  const valorTotalVenda = computed(() => {
    return valorTotalItens.value - formData.value.desconto
  })

  const valorTotalPagamentos = computed(() => {
    return formData.value.pagamentos.reduce((total, pagamento) => {
      return total + pagamento.valor
    }, 0)
  })

  const hasPaymentDifference = computed(() => {
    return Math.abs(valorTotalVenda.value - valorTotalPagamentos.value) >= 0.01
  })

  const isFormValid = computed(() => {
    return (
      formData.value.vendedorId &&
      formData.value.itens.length > 0 &&
      formData.value.itens.every((item) => item.produtoId && item.quantidade > 0 && item.precoUnit >= 0) &&
      formData.value.pagamentos.length > 0 &&
      formData.value.pagamentos.every((pagamento) => pagamento.valor > 0) &&
      Math.abs(valorTotalVenda.value - valorTotalPagamentos.value) < 0.01
    )
  })

  // Funções para buscar dados
  async function fetchVendedores() {
    if (!isClient.value) return

    try {
      const response = await $fetch('/api/vendedores')
      vendedores.value = response.map((v) => ({ value: v.id, label: v.nome }))
    } catch (err) {
      console.error('Erro ao buscar vendedores:', err)
    }
  }

  async function fetchProdutos() {
    if (!isClient.value) return

    try {
      const response = await $fetch('/api/produtos')
      produtos.value = response.map((p) => ({
        value: p.id,
        label: p.nome,
        preco: p.preco,
        estoque: p.estoque,
      }))
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    }
  }

  // Funções para manipular itens
  function addItem() {
    formData.value.itens.push({
      produtoId: '',
      quantidade: 1,
      precoUnit: 0,
    })
  }

  function removeItem(index) {
    if (formData.value.itens.length > 1) {
      formData.value.itens.splice(index, 1)
    }
  }

  function onProdutoChange(index) {
    const item = formData.value.itens[index]
    const produto = produtos.value.find((p) => p.value === item.produtoId)
    if (produto) {
      item.precoUnit = Number(produto.preco)
    }
  }

  // Funções para manipular pagamentos
  function addPagamento() {
    formData.value.pagamentos.push({
      valor: 0,
      formaPagamento: 'DINHEIRO',
      dataVencimento: '',
      observacoes: '',
    })
  }

  function removePagamento(index) {
    if (formData.value.pagamentos.length > 1) {
      formData.value.pagamentos.splice(index, 1)
    }
  }

  function distribuirPagamento() {
    if (formData.value.pagamentos.length === 1) {
      formData.value.pagamentos[0].valor = valorTotalVenda.value
    }
  }

  function convertToBRL(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  // Função para submeter o formulário
  async function submitForm() {
    if (!isFormValid.value) return

    try {
      loading.value = true
      error.value = null

      const response = await $fetch('/api/vendas', {
        method: 'POST',
        body: formData.value,
      })

      success.value = true

      // Redirecionar para a lista de vendas após 2 segundos
      setTimeout(() => {
        navigateTo('/vendas')
      }, 2000)
    } catch (err) {
      console.error('Erro ao criar venda:', err)
      error.value = err.data?.message || err.message || 'Erro ao criar venda'
    } finally {
      loading.value = false
    }
  }

  function cancelar() {
    navigateTo('/vendas')
  }

  // Carregar dados iniciais
  onMounted(async () => {
    await nextTick()
    isClient.value = true
    isMounted.value = true

    // Carregar dados iniciais
    await Promise.all([fetchVendedores(), fetchProdutos()])
  })

  // Watch para distribuir pagamento automaticamente
  watch(valorTotalVenda, (newValue) => {
    if (formData.value.pagamentos.length === 1 && formData.value.pagamentos[0].valor === 0) {
      formData.value.pagamentos[0].valor = newValue
    }
  })
</script>

<template>
  <ClientOnly>
    <div
      v-if="isMounted"
      class="flex w-full flex-col gap-6"
    >
      <HeaderSection title="Nova Venda">
        <template #actions>
          <Button
            variant="outline"
            @click="cancelar()"
          >
            <Icon
              name="i-lucide-x"
              class="mr-2"
            />
            Cancelar
          </Button>
        </template>
      </HeaderSection>

      <!-- Mensagem de sucesso -->
      <Alert
        v-if="success"
        variant="default"
        class="border-green-200 bg-green-50"
      >
        <Icon
          name="i-lucide-check-circle"
          class="h-4 w-4 text-green-600"
        />
        <AlertTitle class="text-green-800">Sucesso!</AlertTitle>
        <AlertDescription class="text-green-700">Venda criada com sucesso! Redirecionando...</AlertDescription>
      </Alert>

      <!-- Mensagem de erro -->
      <Alert
        v-if="error"
        variant="destructive"
      >
        <Icon
          name="i-lucide-alert-circle"
          class="h-4 w-4"
        />
        <AlertTitle>Erro ao salvar a venda</AlertTitle>
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <form @submit.prevent="submitForm">
        <!-- Informações básicas -->
        <Card class="mb-6">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label for="vendedor">Vendedor *</Label>
                <Select
                  v-model="formData.vendedorId"
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="vendedor in vendedores"
                      :key="vendedor.value"
                      :value="vendedor.value"
                    >
                      {{ vendedor.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label for="desconto">Desconto (R$)</Label>
                <Input
                  id="desconto"
                  v-model.number="formData.desconto"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div>
              <Label for="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                v-model="formData.observacoes"
                placeholder="Observações sobre a venda..."
                rows="3"
              />
            </div>
          </CardContent>
        </Card>

        <!-- Itens da venda -->
        <Card class="mb-6">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Itens da Venda</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                @click="addItem()"
              >
                <Icon
                  name="i-lucide-plus"
                  class="mr-2 h-4 w-4"
                />
                Adicionar Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="(item, index) in formData.itens"
                :key="index"
                class="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-5"
              >
                <div class="md:col-span-2">
                  <Label :for="`produto-${index}`">Produto *</Label>
                  <Select
                    v-model="item.produtoId"
                    @update:model-value="onProdutoChange(index)"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="produto in produtos"
                        :key="produto.value"
                        :value="produto.value"
                      >
                        {{ produto.label }} - R$ {{ produto.preco }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label :for="`quantidade-${index}`">Quantidade *</Label>
                  <Input
                    :id="`quantidade-${index}`"
                    v-model.number="item.quantidade"
                    type="number"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <Label :for="`preco-${index}`">Preço Unit. *</Label>
                  <Input
                    :id="`preco-${index}`"
                    v-model.number="item.precoUnit"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div class="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    :disabled="formData.itens.length === 1"
                    @click="removeItem(index)"
                  >
                    <Icon
                      name="i-lucide-trash-2"
                      class="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div class="bg-muted mt-4 rounded-lg p-4">
              <div class="flex items-center justify-between text-sm">
                <span>Subtotal dos Itens:</span>
                <span class="font-medium">
                  {{ convertToBRL(valorTotalItens) }}
                </span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span>Desconto:</span>
                <span class="font-medium">
                  -
                  {{ convertToBRL(formData.desconto) }}
                </span>
              </div>
              <div class="mt-2 flex items-center justify-between border-t pt-2 text-lg font-bold">
                <span>Total da Venda:</span>
                <span>
                  {{ convertToBRL(valorTotalVenda) }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Pagamentos -->
        <Card class="mb-6">
          <CardHeader>
            <div class="flex items-center justify-between">
              <CardTitle>Pagamentos</CardTitle>
              <div class="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="distribuirPagamento()"
                >
                  <Icon
                    name="i-lucide-calculator"
                    class="mr-2 h-4 w-4"
                  />
                  Distribuir
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  @click="addPagamento()"
                >
                  <Icon
                    name="i-lucide-plus"
                    class="mr-2 h-4 w-4"
                  />
                  Adicionar Pagamento
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="(pagamento, index) in formData.pagamentos"
                :key="index"
                class="grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-4"
              >
                <div>
                  <Label :for="`valor-${index}`">Valor *</Label>
                  <Input
                    :id="`valor-${index}`"
                    v-model.number="pagamento.valor"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <Label :for="`forma-${index}`">Forma de Pagamento *</Label>
                  <Select v-model="pagamento.formaPagamento">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        v-for="forma in formasPagamento"
                        :key="forma.value"
                        :value="forma.value"
                      >
                        {{ forma.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label :for="`vencimento-${index}`">Data Vencimento</Label>
                  <Input
                    :id="`vencimento-${index}`"
                    v-model="pagamento.dataVencimento"
                    type="date"
                  />
                </div>

                <div class="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    :disabled="formData.pagamentos.length === 1"
                    @click="removePagamento(index)"
                  >
                    <Icon
                      name="i-lucide-trash-2"
                      class="h-4 w-4"
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div class="bg-muted mt-4 rounded-lg p-4">
              <div class="flex items-center justify-between text-lg font-bold">
                <span>Total dos Pagamentos:</span>
                <span :class="hasPaymentDifference ? 'text-red-600' : 'text-green-600'">
                  {{ convertToBRL(valorTotalPagamentos) }}
                </span>
              </div>
              <div
                v-if="hasPaymentDifference"
                class="mt-1 text-sm text-red-600"
              >
                Diferença:
                {{ convertToBRL(Math.abs(valorTotalVenda - valorTotalPagamentos)) }}
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Botões de ação -->
        <div class="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            @click="cancelar()"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            :disabled="!isFormValid || loading"
            class="min-w-32"
          >
            <Icon
              v-if="loading"
              name="i-lucide-loader-2"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <Icon
              v-else
              name="i-lucide-save"
              class="mr-2 h-4 w-4"
            />
            {{ loading ? 'Salvando...' : 'Salvar Venda' }}
          </Button>
        </div>
      </form>
    </div>

    <!-- Fallback durante carregamento -->
    <template #fallback>
      <div class="flex w-full flex-col gap-6">
        <div class="flex items-center justify-between">
          <div class="bg-muted h-8 w-32 animate-pulse rounded" />
          <div class="bg-muted h-10 w-28 animate-pulse rounded" />
        </div>
        <div class="bg-muted h-96 w-full animate-pulse rounded" />
      </div>
    </template>
  </ClientOnly>
</template>
