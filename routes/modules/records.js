const express = require('express')
const router = express.Router()
const Handlebars = require("handlebars")
const Record = require('../../models/record')
const Category = require('../../public/js/category')

// Create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const record = req.body // 從 req.body 拿出表單裡的資料
  return Record.create(record) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// Update
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id) // 利用id查詢資料庫的資料
    .lean()
    .then((record) => {
      res.render('edit', {
        record
      })
    }) // 若找到資料，將它傳給 edit 樣板
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => {
      record = Object.assign(record, req.body)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

Handlebars.registerHelper('selected', function (value, test) {
  if (value == undefined) return ''
  return value === test ? 'selected' : ''
});

// Delete
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// Filter - 先篩選出類別及項目內容，再計算總金額
router.get('/', async (req, res) => {
  const selectedCategory = Object.keys(req.query)[0]
  let total = 0
  let noResult = ''
  let records = []
  let amountData = []

  try {
    records = await Record.find({
      category: selectedCategory
    }).lean()
    amountData = await Record.aggregate([{
        $match: { "category": selectedCategory }
      },
      {
        "$group": {
          _id: null,
          amount: { $sum: "$amount"}
        }
      },
      { $project: { _id: 0 } }
    ])

    if (amountData.length === 0) {
      noResult = 'No expense in this category so far.'
      return res.render('index', {
        noResult,
        total
      })
    }

    total = amountData[0]['amount']

    // match category icon
    records.map(record => {
      Category.results.map(category => {
        if (record.category === category.name) record.icon = category.icon
      })
    })

    return res.render('index', {
      records,
      total
    })

  } catch (err) {
    console.log(err);
  }
})

module.exports = router