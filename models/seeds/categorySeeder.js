const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const Category = require('../category')
const db = require('../../config/mongoose')
const expenseCategories = require('./category.json')

db.once('open', async () => {
  try {
    for (const category of expenseCategories) {
      await Category.create(category)
    }
    console.log('CategorySeeder done.')
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
})