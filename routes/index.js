const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const records = require('./modules/records')
const users = require('./modules/users')

const { authenticator } = require('../middleware/auth')  // 掛載 middleware

router.use('/records', authenticator, records)
router.use('/users', users)
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router