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
    photo_id:{type:String,  default :null},
     proof_of_ownership:{type:String, default :"null"},
     shop_image_front:{type:String, default :"null" },
     foot_hygiene_registration:{type:String, default :"null "},
     permission_to_trade:{type:String, default :"null" },
    
    menu:{type:String,  default :"null"},
    restaurant_logo:{type:String,  default :"null"},
   
    address_of_welcome_pack:String,
   
    account_holder_name: String,
    
    account_number: String,
    bank_name: String,
    sort_code :String,
    drivers_availability: String,
    business_operate: String,
    typeof_location: String,
    status: Boolean,
    is_registered: Boolean,
    user_type: String
});

module.exports = mongoose.model('signup', signup);

