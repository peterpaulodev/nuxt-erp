import { prisma } from '~/lib/prisma'

export default defineEventHandler(async event => {
  try {
    const query = getQuery(event)

    // Construir filtros baseados na query
    const where: any = {}

    if (query.status) {
      where.status = query.status
    }

    if (query.vendedor) {
      where.vendedorId = query.vendedor
    }

    if (query.dataInicio || query.dataFim) {
      where.createdAt = {}
      if (query.dataInicio) {
        where.createdAt.gte = new Date(query.dataInicio as string)
      }
      if (query.dataFim) {
        const dataFim = new Date(query.dataFim as string)
        dataFim.setHours(23, 59, 59, 999) // Incluir todo o dia
        where.createdAt.lte = dataFim
      }
    }

    // Buscar vendas com relacionamentos
    const vendas = await prisma.venda.findMany({
      where,
      include: {
        vendedor: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        itens: {
          include: {
            produto: {
              select: {
                id: true,
                nome: true,
                preco: true,
              },
            },
          },
        },
        pagamentos: {
          select: {
            id: true,
            valor: true,
            formaPagamento: true,
            status: true,
            dataPagamento: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Formatar dados para o frontend
    const vendasFormatadas = vendas.map(venda => ({
      id: venda.id,
      numero: venda.numero,
      vendedor: venda.vendedor,
      valorTotal: venda.valorTotal,
      status: venda.status,
      createdAt: venda.createdAt,
      updatedAt: venda.updatedAt,
      itens: venda.itens,
      pagamentos: venda.pagamentos,
      // Informações adicionais úteis
      totalItens: venda.itens.length,
      valorPago: venda.pagamentos
        .filter(p => p.status === 'PAGO')
        .reduce((sum, p) => sum + Number(p.valor), 0),
    }))

    return vendasFormatadas
  } catch (error) {
    console.error('Erro ao buscar vendas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao buscar vendas',
    })
  }
})
