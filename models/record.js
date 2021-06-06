// Record model - data schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String, 
    required: true 
  },
  date: {
    type: String, 
    required: true 
  },
  merchant: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {  // 加入user關聯設定
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
})

module.exports = mongoose.model('Record', recordSchema)