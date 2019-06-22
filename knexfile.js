module.exports = (() => {
  let config = {
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  }

  const inMemoryEnabled = Boolean(process.env.SQLITE_INMEMORY)

  config = {
    ...config,
    client: 'sqlite3',
    connection: {
      filename: './db/dev.sqlite'
    },
    useNullAsDefault: true
  }

  if (inMemoryEnabled) {
    config = {
      ...config,
      connection: ':memory:',
      pool: {
        min: 1,
        max: 1,
        // SEE: https://github.com/tgriesser/knex/issues/1871
        disposeTimeout: 360000 * 1000,
        idleTimeoutMillis: 360000 * 1000
      }
    }
  }

  return config
})()
