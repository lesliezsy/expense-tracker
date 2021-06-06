const Category = require('../category')
const db = require('../../config/mongoose')
const expenseCategories = require('./category.json')

db.once('open', async () => {
  try {
    for (const category of expenseCategories) {
      await Category.create(category)
    }
    await db.close()
    console.log('Category seeder done.')
  } catch (err) {
    console.log(err)
  }
})