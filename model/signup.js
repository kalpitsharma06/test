const mongoose = require('mongoose');
const con = require('../database/db')

var signupSchema = new mongoose.Schema({
    restaurant_name:String,
    restaurant_address: String,
    contact_number: Number,
    email: String,
    password: String
});

module.exports = mongoose.model('signup', signupSchema);

