const mongoose = require('mongoose');

let usersignup = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    status: Boolean,
    is_registered: Boolean,
    type: String,
    guest_id:{type:String},
    password: { type: String },
  
    address_book:[{
    address: { type: String },
    city: { type: String },
    postcode: { type: String },
    address_title:{type:String},
   
    mobile:{type:String},
   


}],

      get_order_update_email:Boolean,
      get_order_update_text:Boolean,
      get_new_offers_email:Boolean,
      get_new_offers_text:Boolean,


  });

module.exports = mongoose.model("usersignup", usersignup);  