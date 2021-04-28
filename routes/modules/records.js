const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

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



// Update: Edit a record's info
// router.get('/:id/edit', (req, res) => {
//   const id = req.params.id
//   return Record.findById(id) // 利用id查詢資料庫的資料
//       .lean()
//       .then((record) => res.render('edit', {
//           record
//       })) // 若找到資料，將它傳給 edit 樣板
//       .catch(error => console.log(error))
// })

// router.put('/:id', (req, res) => {
//   const id = req.params.id
//   return Restaurant.findById(id)
//       .then(record => {
//           record = Object.assign(record, req.body)
//           return record.save()
//       })
//       .then(() => res.redirect(`/records/${id}`))
//       .catch(error => console.log(error))
// })

module.exports = router
