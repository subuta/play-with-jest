import Koa from 'koa'
import logger from 'koa-logger'
import koaBody from 'koa-body'

import consola from 'consola'

import api from './api'

const app = new Koa()

const port = parseInt(process.env.PORT, 10) || 3000

// Log requests
app.use(logger())

// Parse body
app.use(koaBody())

app.use((ctx, next) => {
  // Inject DB reference to koa context.
  ctx.state.db = require('utils/db').default
  return next()
})

// Load routes
app.use(api.routes())
app.use(api.allowedMethods())

app.listen(port, () => {
  consola.info(`🚀 Server ready at http://localhost:${port}`)
})
