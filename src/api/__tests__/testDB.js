import knex from 'knex'

import connection from '../../../knexfile'

const fs = require('fs')
const _ = require('lodash')

const tempy = require('tempy')

export default async () => {
  const db = knex(connection)

  const tempFile = tempy.file({ extension: 'sqlite' })
  fs.copyFileSync(require.resolve('../../../db/dev.sqlite'), tempFile)

  // Restore DB.
  await db.raw(`ATTACH '${tempFile}' as dev`)

  // SEE: https://stackoverflow.com/a/5901100/9998350
  // Enable foreignKey support.
  await db.raw(`PRAGMA foreign_keys = ON`)

  return db
}
