const express = require('express')
const router = express.Router()
const Handlebars = require("handlebars")
const Record = require('../../models/record')
const Category = require('../../models/category')

// Filter - 先篩選出類別及項目內容，再計算總金額
Handlebars.registerHelper('ifEquals', function(value1, value2, options) {
  return (value1 === value2) ? 'selected' : '';
});

router.get('/', async (req, res) => {
  const { _id:userId } = req.user
  const { category, month } = req.query
  const regMonth = new RegExp(month, 'i') 
  // 找到使用者的expense資料，再去篩選類別或月份
  try {
    // 取得 消費類別
    const categories = await Category.find().lean()
    // 取得 使用者消費紀錄
    const records = await Record.aggregate([
    // 比對 user, category, 資料庫跟req的年月 
     // 如果月份或類別沒選，就預設全部 ************
      { $match: { $and: [getCategory(category), { date: {$regex : regMonth} }, { userId } ] } },
      { $sort : { date: -1 } }
    ])

    // 計算總消費額
    let totalAmount = 0
    for (let i = 0; i < records.length; i++) {
      totalAmount += records[i].amount
      // 設定 Category 的 icon
      for (let j = 0; j < categories.length; j++) {
        if (records[i].category === categories[j].name) {
          records[i].icon = categories[j].icon
        }
      }
    }
    res.render('index', { categories, records, totalAmount, month, category})

  } catch (err) {
    console.log(err)
  }
})

module.exports = router

function getCategory(category) {
  // 如果沒選，就回傳空物件
  if (category === 'Category' || category === undefined) return {}
  return { category }
}