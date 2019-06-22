import getTestDB from './testDB'

import getTestClient from './testClient'
import fakeDB from './fakeDB'

let mockApplyTax

describe('/api with mock', () => {
  let client

  beforeEach(() => {
    jest.resetModules()

    mockApplyTax = jest.fn((price) => price)

    jest.mock('../../utils/tax', () => {
      return mockApplyTax
    })

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
        price: 100,
        created_at: jasmine.any(String),
        updated_at: jasmine.any(String)
      },
      {
        id: 2,
        name: 'Tomato',
        price: 200,
        created_at: jasmine.any(String),
        updated_at: jasmine.any(String)
      },
      {
        id: 3,
        name: 'Lettuce',
        price: 150,
        created_at: jasmine.any(String),
        updated_at: jasmine.any(String)
      }
    ])

    const calls = mockApplyTax.mock.calls
    expect(calls.length).toEqual(3)

    expect(calls[0]).toEqual([100, 1.08])
    expect(calls[1]).toEqual([200, 1.08])
    expect(calls[2]).toEqual([150, 1.08])
  })

  test('GET /api/items/1', async () => {
    const response = await client
      .get('/api/items/1')
      .send()
      .expect(200)

    expect(response.body).toEqual({
      id: 1,
      name: 'Bacon',
      price: 100,
      created_at: jasmine.any(String),
      updated_at: jasmine.any(String)
    })

    const calls = mockApplyTax.mock.calls
    expect(calls.length).toEqual(1)

    expect(calls[0]).toEqual([100, 1.08])
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
      price: 300,
      created_at: jasmine.any(String),
      updated_at: jasmine.any(String)
    })

    const calls = mockApplyTax.mock.calls
    expect(calls.length).toEqual(1)

    expect(calls[0]).toEqual([300, 1.08])
  })
})
