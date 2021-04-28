const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/', async (req, res) => {
  try {
    // aggregate 不需要使用 lean()
    const amountData = await Record.aggregate(
      [{
        $group: { _id: null, amount: { $sum: "$amount" } }
      }]
    )

    const total = amountData[0]['amount']
    const records = await Record.find().lean()
    const categoryData = await Category.find().lean()

    records.map(record => {
      categoryData.map(category => {
        if (record.category === category.name) record.icon = category.icon
      })

    })

    res.render('index', {
      records,
      total
    })

  } catch (err) {
    console.log(err)
  }
})

module.exports = router