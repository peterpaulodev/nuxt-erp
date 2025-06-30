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

async function onSubmit(values) {
  console.log('values :', values)
  toast({
    title: 'Produto salvo com sucesso!',
  })
  navigateTo('/produtos')
}
</script>

<template>
  <Card class="rounded-2xl p-4 shadow-sm">
    <CardHeader>
      <CardTitle>Novo produto</CardTitle>
      <CardDescription>
        <div>Cadastre um novo produto.</div>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Form :validation-schema="productFormSchema" class="space-y-8" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input class="w-1/2" type="text" placeholder="Nome do produto" v-bind="componentField" />
            </FormControl>
            <FormDescription> Esse nome será exibido no aplicativo. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="price">
          <FormItem>
            <FormLabel>Preço</FormLabel>
            <FormControl>
              <Input class="w-1/2" type="text" placeholder="Preço do produto" v-bind="componentField" />
            </FormControl>
            <FormDescription>
              Preço pelo qual o produto será vendido.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="active">
          <FormItem>
            <FormControl>
              <div class="flex items-center space-x-3">
                <Switch :checked="componentField.modelValue" />
                <label>Ativo</label>
              </div>
            </FormControl>
            <FormDescription>
              Se o produto estiver ativo, ele pode ser vendido.
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
