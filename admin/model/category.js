const mongoose = require('mongoose');
const con = require('../../database/db')

const category = new mongoose.Schema({
  category_name:String,
  category_id:String,
  image:String,
});

module.exports = mongoose.model('category', category)

