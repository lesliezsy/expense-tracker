const express = require('express')
const router = express.Router()
const Handlebars = require("handlebars")
const Record = require('../../models/record')

// Create
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const record = req.body // 從 req.body 拿出表單裡的資料
  record.userId = req.user._id

  console.log("req.body: ", record)

  return Record.create(record) // 原封不動將這筆 obj 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// Update
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId }) // 利用id查詢資料庫的資料
    .lean()
    .then((record) => {
      res.render('edit', { record })
    }) // 若找到資料，將它傳給 edit 樣板
    .catch(error => console.log(error))
})

router.put('/:id', async (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return await Record.findOne({ _id, userId })
    .then(record => {
      // 找到特定user的某筆花費資料，將欲更新內容放進去
      record = Object.assign(record, req.body)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 編輯時，設定 category 原本已選的項目 為 selected
Handlebars.registerHelper('selected', function(value, test) {
  if (value == undefined) return ''
  return value === test ? 'selected' : ''
});

// Delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router