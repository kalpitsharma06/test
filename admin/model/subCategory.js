const mongoose = require('mongoose');
const con = require('../../database/db')

var subcategory = new mongoose.Schema({
    sub_category_name : String,
    image : String,
    category:{ type: mongoose.Types.ObjectId, ref: "category" },
    status:String,
});

module.exports = mongoose.model('subcategory', subcategory);