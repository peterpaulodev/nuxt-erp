<script setup>
import { sellersColumns } from '@/constants/datatable/columns'
import HeaderSection from '@/pages/components/header-section.vue'
import DataTable from '../components/datatable.vue'

const users = [
  {
    id: 1,
    name: 'João da Silva',
    email: 'joao@email.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    initials: 'JS',
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    avatar: 'https://i.pravatar.cc/400?img=48',
    initials: 'MO',
  },
]

function editUser(user) {
  navigateTo(`/vendedores/${user.id}/editar`)
}

function deleteUser(user) {
  console.log('Deletar', user)
}

function goTonewUserPage() {
  navigateTo('/vendedores/novo')
}
</script>

<template>
  <div class="flex w-full flex-col gap-6">
    <HeaderSection title="Vendedores">
      <template #actions>
        <Button @click="goTonewUserPage()">
          <Icon name="i-lucide-plus" class="mr-2" />
          Novo
        </Button>
      </template>
    </HeaderSection>
    <DataTable :columns="sellersColumns" :data="users" />

    <!-- <Card class="rounded-2xl p-4 shadow-sm">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead class="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in users" :key="user.id">
              <TableCell>
                <Avatar>
                  <AvatarImage :src="user.avatar" />
                  <AvatarFallback>{{ user.initials }}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{{ user.name }}</TableCell>
              <TableCell>{{ user.email }}</TableCell>
              <TableCell class="text-right">
                <div class="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" @click="editUser(user)">
                    <Icon name="i-lucide-edit" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="deleteUser(user)">
                    <Icon name="i-lucide-trash-2" class="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card> -->
  </div>
</template>
