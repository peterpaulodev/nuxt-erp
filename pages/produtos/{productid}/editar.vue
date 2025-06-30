<script setup>
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { toast } from '~/components/ui/toast'

const productFormSchema = toTypedSchema(
  z.object({
    name: z
      .string({
        required_error: 'Campo obrigatório.',
      }),
    price: z.string({ required_error: 'Campo obrigatório.' }),
    active: z.boolean({ required_error: 'Campo obrigatório.' }).default(true),
  }),
)

const { productid } = useRoute().params

async function onSubmit(values) {
  console.log('values :', values, productid)
  toast({
    title: 'Usuário salvo com sucesso!',
  })
  navigateTo('/vendedores')
}
</script>

<template>
  <Card class="rounded-2xl p-4 shadow-sm">
    <CardHeader>
      <CardTitle>Novo vendedor</CardTitle>
      <CardDescription>
        <div>Cadastre um novo vendedor.</div>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form :validation-schema="productFormSchema" class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input class="w-1/2" type="text" placeholder="Nome do vendedor" v-bind="componentField" />
            </FormControl>
            <FormDescription> Esse nome será exibido no aplicativo. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input class="w-1/2" type="text" placeholder="Email do vendedor" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Esse email será utilizado para acessar o aplicativo.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <div class="flex justify-start">
          <Button type="submit">Salvar</Button>
        </div>
      </Form>
    </CardContent>
  </Card>
</template>
