const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const Record = require('../record')
const User = require('../user')
const db = require('../../config/mongoose')

const expenseRecords = require('./record.json');

const SEED_USERS = [{
    name: 'Leslie',
    email: 'leslie@gmail.com',
    password: '123'
  },
  {
    name: 'Json',
    email: 'json@gmail.com',
    password: '123'
  }
]

db.once('open', async () => {
  // 「成功連線資料庫」之後，寫「新增資料」的腳本
  try {
    for (const [index, user] of SEED_USERS.entries()) {
      const { name, email, password } = user
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const { _id: userId } = await User.create({
        name,
        email,
        password: hash
      })

      // 新增花費紀錄
      for (const record of expenseRecords) {
        const allData = await Record.create({ ...record , userId });
      }
      
    }
    console.log('recordSeeder done')
    process.exit()

  } catch (err) {
    console.log(err)
    process.exit()
  }
})