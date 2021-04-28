const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Handlebars = require("handlebars")

// Create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  console.log(req.body)
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
      console.log(record);
      }) // 若找到資料，將它傳給 edit 樣板
      .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  console.log(req.params)
  return Record.findById(id)
      .then(record => {
          record = Object.assign(record, req.body)
          return record.save()
      })
      .then(() => res.redirect(`/`))
      .catch(error => console.log(error))
})

Handlebars.registerHelper('selected', function (value, test) {
  if (value == undefined) return ''
  return value === test ? 'selected' : ''
});

module.exports = router
