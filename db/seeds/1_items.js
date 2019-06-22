exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('items').del()

  await knex('items').insert([
    { name: 'Bacon', price: 100 },
    { name: 'Tomato', price: 200 },
    { name: 'Lettuce', price: 150 }
  ])
}
