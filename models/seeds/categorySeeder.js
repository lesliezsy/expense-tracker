const Category = require('../category') // 載入 todo model，因為這裡要操作的資料和 Todo 有關。
const db = require('../../config/mongoose')

const categoryList = require('./category.json');

db.once('open', () => {
  
  for (i = 0; i < categoryList.results.length; i++) {
    Category.create(categoryList.results[i]);
  }
  console.log('done')
})