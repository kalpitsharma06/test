const mongoose = require('mongoose');
const con = require('../../database/db')

const category = new mongoose.Schema({
  category_name:String,
  restaurant_id:{ type: mongoose.Types.ObjectId, ref: "signup" },
  image:String,
});

module.exports = mongoose.model('category', category)

