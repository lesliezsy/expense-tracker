// Record model - data schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String, 
    required: true 
  },
  category: {
    type: String, 
    required: true 
  },
  amount: {
    type: Number,
    required: true
  }
})

const Record = mongoose.model('Record', recordSchema)

module.exports =  Record