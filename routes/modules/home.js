const express = require('express')
const router = express.Router()
// const Handlebars = require("handlebars")
const moment = require('moment')

const Record = require('../../models/record')
const Category = require('../../models/category')
// const Category = require('../../public/js/category')

// Filter - 先篩選出類別及項目內容，再計算總金額
// Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
//   return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
// });

router.get('/', async (req, res) => {
  console.log("月份: ", req.query.month, "類別: ", req.query.category);
  const userId = req.user._id
  const { category, month } = req.query
  // 找到使用者的expense資料，再去篩選類別或月份
  // 如果月份或類別沒選，就預設全部 ************
  try {
    // 取得 消費類別
    const categories = await Category.find().lean()
    // 取得 使用者消費紀錄
    const records = await Record.aggregate([
    // 比對 user, category, 資料庫跟req的年月 
      { $match: { $and: [getCategory(category), { userId } ] } },
      // { "$group": { _id: null, amount: { $sum: "$amount" } } },
      // { $project: { _id: 0 } }
    ])
    console.log("userExpenses: ", records);

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
    // console.log("totalAmount: ", totalAmount)
    res.render('index', { categories, records, totalAmount })

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

function getMonth(month) {
  console.log("month: ", month);
  // moment(month).format('MM')
  if (month === '' || month === undefined) return {}
  return moment(month).format('MM')
}