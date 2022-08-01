const mongoose = require('mongoose');
const con = require('../../database/db')

var signup = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
   
    menu:String,
    restaurant_logo:String,
   
    address_of_welcome_pack:String,
   
    account_holder_name: String,
    
    account_number: String,
    bank_name: String,
    sort_code :String,
   
    is_registered: Boolean,
    user_type: String,
});

module.exports = mongoose.model('signup', signup);

