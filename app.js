const express = require('express')
const exphbs = require('express-handlebars')
const { urlencoded } = require("body-parser")
const methodOverride = require('method-override')
const routes = require('./routes')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))

app.set('view engine', 'hbs')
app.use(urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)
app.use(express.static('public'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})

// 待優化項目： 
// hbs的option 可用each解決 不用重複 
// filter 應該可以把find跟aggregate做整合 有更佳做法
// category 應該不用做成seeder 放在public當靜態檔案輸出使用即可