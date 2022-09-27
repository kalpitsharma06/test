const mongoose = require('mongoose');
// const con = require('../../database/db')

const signup = new mongoose.Schema({
    loc: {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        cordinates: [
          Number
        ]
      },
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    restaurant_id:String,
    restaurant_name: {type:String,  default :"unverified Restaurant"},
    owner_name: String,
    owner_email:String,
    owner_address:String,
    owner_pincode:String,
    owner_status:Boolean,
    gender:String,
    restaurant_address: String,
    pincode:String,
    city: String,
    address_status:Boolean,
    
    contact_number: Number,
    email: String,
    password: String,
    country:String,
   
    primary_cuisine: String,
    secoundry_cuisine: String,
    meal_timming:String,
    photo_id_name:{type:String},
    photo_id:{type:String,  default :null},

     ownership_certificate_name:{type:String},
     proof_of_ownership:{type:String, default :"null"},
     shop_image_front:{type:String, default :"null" },
     foot_hygiene_registration:{type:String, default :"null "},
     permission_to_trade:{type:String, default :"null" },
    menu_status:Boolean,
    menu:{type:String,  default :"null"},
    restaurant_logo:{type:String,  default :"https://xntproject.s3.amazonaws.com/just-eat/1663572413101-images%20%281%29.png"},
   
    address_of_welcome_pack:String,
   bank_status:Boolean,
    account_holder_name: String,
    
    account_number: String,
    bank_name: String,
    ifsc_code :String,
    drivers_availability: String,
    business_operate: String,
    typeof_location: String,
    status: Boolean,
    is_registered: Boolean,
    user_type: String,


});

signup.index({ loc : "2dsphere" });

module.exports = mongoose.model('signup', signup);

