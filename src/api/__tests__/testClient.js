import Koa from 'koa'
import request from 'supertest'

import compose from 'koa-compose'
import koaBody from 'koa-body/index'

export default (...middlewares) => {
  const app = new Koa()

  middlewares = [
    koaBody(),
    ...middlewares
  ]

  // Mount middlewares
  app.use(compose(middlewares))

  const server = app.listen(0)
  const client = request(server)

  client.server = server
  client.destroy = () => {
    server.close()
  }

  return client
}
