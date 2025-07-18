import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // Construir filtros baseados na query
    const where: any = {
      ativo: true, // Apenas produtos ativos
    }

    if (query.categoria) {
      where.categoria = query.categoria
    }

    if (query.search) {
      where.OR = [
        { nome: { contains: query.search as string, mode: 'insensitive' } },
        { descricao: { contains: query.search as string, mode: 'insensitive' } },
      ]
    }

    // Buscar produtos
    const produtos = await prisma.produto.findMany({
      where,
      select: {
        id: true,
        nome: true,
        descricao: true,
        preco: true,
        categoria: true,
        estoque: true,
      },
      orderBy: {
        nome: 'asc',
      },
    })

    return produtos
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar produtos',
    })
  }
})
