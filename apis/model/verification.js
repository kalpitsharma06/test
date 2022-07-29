const mongoose = require('mongoose');
const con = require('../../database/db')

var signup = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    restaurant_name: String,
    restaurant_address: String,
    city: String,
    lattitude: Number,
    longitude: Number,
    contact_number: Number,
    email: String,
    password: String,
    first_name: String,
    last_name: String,
    primary_cuisine: String,
    secoundry_cuisine: String,
    // photo_id:{type:String, required:true},
    //  proof_of_ownership:{type:String, required:true},
    //  shop_image_front:{type:String, required:true},
    //  foot_hygiene_registration:{type:String, required:true},
    //  permission_to_trade:{type:String, required:true},
    // menu:String,
    // restaurant_logo:String,
    // bank_details:String,
    // address_of_welcome_pack:String,
    // account_holder_type: String,
    // account_holder_name: String,
    // routing_number: String,
    // account_number: String,
    // bank_name: String,
    // bank_id: String,
    drivers_availability: String,
    bussiness_operate: String,
    typeof_location: String,
    status: Boolean,
    is_registered: Boolean,
    user_type: String
});

module.exports = mongoose.model('signup', signup);

