const express = require('express')
const session = require('express-session')
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
app.use(routes)
app.use(express.static('public'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})