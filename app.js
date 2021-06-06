const express = require('express')
const session = require('express-session')
// 載入passport設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')
const exphbs = require('express-handlebars')
const { urlencoded } = require("body-parser")
const methodOverride = require('method-override')
const routes = require('./routes')
// const usePassport = require('./config/passport')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))

// usePassport(app)

app.set('view engine', 'hbs')

app.use(session({
  secret: 'ExpenseTrackerSecret', // session 用來驗證 session id 的字串
  resave: false,
  saveUninitialized: true
}))

app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)
app.use(routes)
app.use(express.static('public'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})