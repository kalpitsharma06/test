const mongoose = require('mongoose');
const con = require('../database/db')

var signup = new mongoose.Schema({
    restaurant_name:String,
    restaurant_address: String,
    contact_number: Number,
    email: String,
    password: String,
    first_name:String,
    last_name:String,
    primary_cuisine:String,
    secoundry_cuisine:String,
    photo_id:String,
    proof_of_ownership:String,
    shop_image_front:String,
    foot_hygiene_registration:String,
    menu:String,
    restaurant_logo:String,
    bank_details:String,
    address_of_welcome_pack:String,
    account_holder_type: String,
    account_holder_name: String,
    routing_number: String,
    account_number: String,
    bank_name: String,
    bank_id: String
});

module.exports = mongoose.model('signup', signup);

