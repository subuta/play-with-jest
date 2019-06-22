exports.up = async function (knex) {
  await knex.schema.createTable('items', function (t) {
    t.increments()
    t.text('name').notNullable()
    t.integer('price').unsigned().notNullable()
    t.timestamps(true, true)
  })
}

exports.down = async function (knex) {
  return knex.schema.dropTableIfExists('items')
}
