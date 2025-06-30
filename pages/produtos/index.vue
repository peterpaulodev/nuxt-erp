<script setup>
import HeaderSection from '@/pages/components/header-section.vue'

const products = [
  {
    id: 1,
    name: 'João da Silva',
    price: 100.0,
    active: true,
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    price: 150.0,
    active: false,
  },
]

function editProduct(user) {
  navigateTo(`/vendedores/${user.id}/editar`)
}

function deleteProduct(user) {
  console.log('Deletar', user)
}

function goTonewProductPage() {
  navigateTo('/produtos/novo')
}
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <HeaderSection title="Produtos">
      <template #actions>
        <Button @click="goTonewProductPage()">
          <Icon name="i-lucide-plus" class="mr-2" />
          Novo
        </Button>
      </template>
    </HeaderSection>
    <Card class="rounded-2xl p-4 shadow-sm">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ativo</TableHead>
              <TableHead class="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="product in products" :key="product.id">
              <TableCell>{{ product.name }}</TableCell>
              <TableCell>{{ product.price }}</TableCell>
              <TableCell><Switch :checked="product.active" /></TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" @click="editProduct(product)">
                    <Icon name="i-lucide-edit" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteProduct(product)">
                    <Icon name="i-lucide-trash-2" class="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
