import getTestDB from './testDB'

import getTestClient from './testClient'
import fakeDB from './fakeDB'

describe('/api', () => {
  let client

  beforeEach(() => {
    const api = require('../').default

    // Inject Test DB reference to koa context.
    const injectTestDB = async (ctx, next) => {
      // Inject fake(transacted) db.
      ctx.state.db = await fakeDB.swap(await getTestDB())
      return next()
    }

    client = getTestClient(
      injectTestDB,
      api.routes(),
      api.allowedMethods()
    )
  })

  afterEach(async () => {
    // Rollback fakeDB changes.
    await fakeDB.restore()
    client.destroy()
  })

  test('GET /api/items', async () => {
    const response = await client
      .get('/api/items')
      .send()
      .expect(200)

    expect(response.body).toEqual([
      {
        id: 1,
        name: 'Bacon',
        price: '¥108',
        created_at: jasmine.any(String),
        updated_at: jasmine.any(String)
      },
      {
        id: 2,
        name: 'Tomato',
        price: '¥216',
        created_at: jasmine.any(String),
        updated_at: jasmine.any(String)
      },
      {
        id: 3,
        name: 'Lettuce',
        price: '¥162',
        created_at: jasmine.any(String),
        updated_at: jasmine.any(String)
      }
    ])
  })

  test('GET /api/items/1', async () => {
    const response = await client
      .get('/api/items/1')
      .send()
      .expect(200)

    expect(response.body).toEqual({
      id: 1,
      name: 'Bacon',
      price: '¥108',
      created_at: jasmine.any(String),
      updated_at: jasmine.any(String)
    })
  })

  test('GET /api/items/100', async () => {
    const response = await client
      .get('/api/items/100')
      .send()
      .expect(404)

    expect(response.status).toEqual(404)
  })

  test('POST /api/items', async () => {
    const response = await client
      .post('/api/items')
      .send({
        name: 'Beef',
        price: 300
      })
      .expect(200)

    expect(response.body).toEqual({
      id: jasmine.any(Number),
      name: 'Beef',
      price: '¥324',
      created_at: jasmine.any(String),
      updated_at: jasmine.any(String)
    })
  })
})
