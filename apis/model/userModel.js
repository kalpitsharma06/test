const mongoose = require('mongoose');

let usersignup = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
  
    
    address: { type: String },
    city: { type: String },
    postcode: { type: String },
    password: { type: String },
    mobile:{type:String},
    status: Boolean,
    is_registered: Boolean,
    type: String,
    guest_id:{type:String},




      get_order_update_email:Boolean,
      get_order_update_text:Boolean,
      get_new_offers_email:Boolean,
      get_new_offers_text:Boolean,


  });

module.exports = mongoose.model("usersignup", usersignup);  