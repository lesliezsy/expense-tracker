const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../public/js/category')

router.get('/', async (req, res) => {

  try {
    const records = await Record.find().lean()
    const amountData = await Record.aggregate(
      [{
        $group: { _id: null, amount: { $sum: "$amount" } }
      },
      { $project: { _id: 0 } }]
    ) // aggregate 不需要使用 lean()

    console.log(amountData[0]);

    const total = amountData[0]['amount'] || '0'
    
    // match category icon
    records.map(record => {
      Category.results.map(category => {
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