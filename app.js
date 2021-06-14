const express = require('express')
const session = require('express-session')
// 載入passport設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const { urlencoded } = require("body-parser")
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const routes = require('./routes')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))

app.set('view engine', 'hbs')

app.use(session({
  secret: process.env.SESSION_SECRET, // session 用來驗證 session id 的字串
  resave: false,
  saveUninitialized: true
}))

app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
app.use(flash())
// 使用 app.use 代表這組 middleware 會作用於所有的路由
app.use((req, res, next) => {
  // req.user 是在反序列化時，取出的 user 資訊，之後會放在 req.user 裡以供後續使用
  // console.log("req user: ", req.user)
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')  // 設定 success_msg 訊息
  res.locals.warning_msg = req.flash('warning_msg')
  next() // 代表此 middleware 執行結束
})
app.use(routes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})