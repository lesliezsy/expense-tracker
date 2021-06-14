const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const Record = require('../record')
const db = require('../../config/mongoose')

const expenseRecords = require('./record.json');

db.once('open', () => {
  // 「成功連線資料庫」之後，寫「新增資料」的腳本
  for (i = 0; i < expenseRecords.results.length; i++) {
    Record.create(expenseRecords.results[i]);
  }
  console.log('done')
})