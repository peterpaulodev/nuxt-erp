import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (_event) => {
  try {
    const vendedores = await prisma.vendedor.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        comissao: true,
        createdAt: true,
      },
      orderBy: {
        nome: 'asc',
      },
    })

    return vendedores
  } catch (error) {
    console.error('Erro ao buscar vendedores:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar vendedores',
    })
  }
})
