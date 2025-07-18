export default defineEventHandler(async event => {
  return {
    message: 'API de vendas funcionando',
    timestamp: new Date().toISOString(),
    query: getQuery(event),
  }
})
