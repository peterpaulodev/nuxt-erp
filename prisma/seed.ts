import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar vendedores
  const vendedor1 = await prisma.vendedor.create({
    data: {
      nome: 'João Silva',
      email: 'joao@pamonharia.com',
      telefone: '(11) 99999-1111',
      comissao: 5.0, // 5%
    },
  })

  const vendedor2 = await prisma.vendedor.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria@pamonharia.com',
      telefone: '(11) 99999-2222',
      comissao: 7.5, // 7.5%
    },
  })

  // Criar produtos
  const produtos = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Pamonha Doce',
        descricao: 'Pamonha doce tradicional',
        preco: 8.50,
        categoria: 'Doce',
        estoque: 50,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Pamonha Salgada',
        descricao: 'Pamonha salgada com queijo',
        preco: 9.00,
        categoria: 'Salgada',
        estoque: 30,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Curau',
        descricao: 'Curau cremoso de milho',
        preco: 6.00,
        categoria: 'Doce',
        estoque: 25,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Bolo de Milho',
        descricao: 'Bolo de milho caseiro',
        preco: 12.00,
        categoria: 'Doce',
        estoque: 15,
      },
    }),
  ])

  // Criar algumas vendas de exemplo
  const venda1 = await prisma.venda.create({
    data: {
      numero: 'V001',
      vendedorId: vendedor1.id,
      valorTotal: 25.50,
      status: 'CONFIRMADA',
      itens: {
        create: [
          {
            produtoId: produtos[0].id, // Pamonha Doce
            quantidade: 2,
            precoUnit: 8.50,
            subtotal: 17.00,
          },
          {
            produtoId: produtos[1].id, // Pamonha Salgada
            quantidade: 1,
            precoUnit: 9.00,
            subtotal: 9.00,
          },
        ],
      },
      pagamentos: {
        create: {
          valor: 25.50,
          formaPagamento: 'PIX',
          status: 'PAGO',
          dataPagamento: new Date(),
        },
      },
    },
  })

  const venda2 = await prisma.venda.create({
    data: {
      numero: 'V002',
      vendedorId: vendedor2.id,
      valorTotal: 18.00,
      status: 'PENDENTE',
      itens: {
        create: [
          {
            produtoId: produtos[2].id, // Curau
            quantidade: 3,
            precoUnit: 6.00,
            subtotal: 18.00,
          },
        ],
      },
      pagamentos: {
        create: {
          valor: 18.00,
          formaPagamento: 'DINHEIRO',
          status: 'PENDENTE',
        },
      },
    },
  })

  console.log('✅ Seed concluído!')
  console.log(`📊 Criados:`)
  console.log(`   - 2 vendedores`)
  console.log(`   - 4 produtos`)
  console.log(`   - 2 vendas`)
  console.log(`   - 3 itens de venda`)
  console.log(`   - 2 pagamentos`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
