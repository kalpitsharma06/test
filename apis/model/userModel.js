const mongoose = require('mongoose');

let usersignup = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
  
    
    address: { type: String },
    city: { type: String },
    postcode: { type: String },
    password: { type: String },
    status: Boolean,
    is_registered: Boolean,
    type: String,
    guest_id:{type:String},

  });

module.exports = mongoose.model("usersignup", usersignup);  