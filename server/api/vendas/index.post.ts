import { prisma } from '~/lib/prisma'
import { z } from 'zod'

// Schema de validação para criação de venda
const createVendaSchema = z.object({
  vendedorId: z.string().min(1, 'Vendedor é obrigatório'),
  desconto: z.number().min(0).default(0),
  observacoes: z.string().optional(),
  itens: z
    .array(
      z.object({
        produtoId: z.string().min(1, 'Produto é obrigatório'),
        quantidade: z.number().min(1, 'Quantidade deve ser maior que 0'),
        precoUnit: z.number().min(0, 'Preço unitário deve ser maior ou igual a 0'),
      }),
    )
    .min(1, 'Pelo menos um item é obrigatório'),
  pagamentos: z
    .array(
      z.object({
        valor: z.number().min(0, 'Valor do pagamento deve ser maior que 0'),
        formaPagamento: z.enum([
          'DINHEIRO',
          'CARTAO_DEBITO',
          'CARTAO_CREDITO',
          'PIX',
          'TRANSFERENCIA',
          'CHEQUE',
        ]),
        dataVencimento: z.string().optional(),
        observacoes: z.string().optional(),
      }),
    )
    .min(1, 'Pelo menos um pagamento é obrigatório'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validar dados de entrada
    const validatedData = createVendaSchema.parse(body)

    // Gerar número sequencial da venda
    const ultimaVenda = await prisma.venda.findFirst({
      orderBy: { numero: 'desc' },
      select: { numero: true },
    })

    const proximoNumero = ultimaVenda
      ? String(Number.parseInt(ultimaVenda.numero) + 1).padStart(6, '0')
      : '000001'

    // Calcular valor total dos itens
    const valorItens = validatedData.itens.reduce((total, item) => {
      return total + item.quantidade * item.precoUnit
    }, 0)

    const valorTotal = valorItens - validatedData.desconto

    // Verificar se o valor total dos pagamentos confere
    const valorPagamentos = validatedData.pagamentos.reduce((total, pagamento) => {
      return total + pagamento.valor
    }, 0)

    if (Math.abs(valorTotal - valorPagamentos) > 0.01) {
      throw createError({
        statusCode: 400,
        statusMessage: 'O valor total dos pagamentos deve ser igual ao valor total da venda',
      })
    }

    // Criar venda com transação
    const venda = await prisma.$transaction(async (tx) => {
      // Criar a venda
      const novaVenda = await tx.venda.create({
        data: {
          numero: proximoNumero,
          vendedorId: validatedData.vendedorId,
          valorTotal,
          desconto: validatedData.desconto,
          observacoes: validatedData.observacoes,
          status: 'PENDENTE',
        },
      })

      // Criar itens da venda
      const itensData = validatedData.itens.map((item) => ({
        vendaId: novaVenda.id,
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        precoUnit: item.precoUnit,
        subtotal: item.quantidade * item.precoUnit,
      }))

      await tx.itemVenda.createMany({
        data: itensData,
      })

      // Criar pagamentos
      const pagamentosData = validatedData.pagamentos.map((pagamento) => ({
        vendaId: novaVenda.id,
        valor: pagamento.valor,
        formaPagamento: pagamento.formaPagamento,
        dataVencimento: pagamento.dataVencimento ? new Date(pagamento.dataVencimento) : null,
        observacoes: pagamento.observacoes,
        status: 'PENDENTE',
      }))

      await tx.pagamento.createMany({
        data: pagamentosData,
      })

      // Buscar venda completa para retorno
      return await tx.venda.findUnique({
        where: { id: novaVenda.id },
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
              dataVencimento: true,
              observacoes: true,
            },
          },
        },
      })
    })

    return {
      success: true,
      data: venda,
      message: `Venda ${proximoNumero} criada com sucesso!`,
    }
  } catch (error: any) {
    console.error('Erro ao criar venda:', error)

    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Dados inválidos',
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro interno do servidor ao criar venda',
    })
  }
})
