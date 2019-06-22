import Router from 'koa-router'
import _ from 'lodash'

import applyTax from 'utils/tax'

const router = new Router({
  prefix: '/api'
})

// Define API
// GET /api/items
router.get('/items', async (ctx) => {
  const db = ctx.state.db

  const items = await db.from('items').select()

  ctx.body = _.map(items, (item) => ({
    ...item,
    price: applyTax(item.price)
  }))
})

// GET /api/items/:id
router.get('/items/:id', async (ctx) => {
  const db = ctx.state.db

  const { id } = ctx.params

  let item = await db.from('items')
    .select()
    .where({ id })
    .first()

  // Handle not found.
  if (!item) {
    ctx.status = 404
    return
  }

  item.price = applyTax(item.price)

  ctx.body = item
})

// POST /api/items
router.post('/items', async (ctx) => {
  const db = ctx.state.db

  let [id] = await db('items')
    .insert(ctx.request.body)

  let item = await db.from('items')
    .select()
    .where({ id })
    .first()

  item.price = applyTax(item.price)

  ctx.body = item
})

export default router
