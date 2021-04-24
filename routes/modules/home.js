const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  // 使用 res.render() 指令，要求渲染一個叫 index 的頁面
  res.render('index')


})

module.exports = router