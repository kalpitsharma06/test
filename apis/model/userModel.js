const mongoose = require('mongoose');

let usersignup = new mongoose.Schema({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
  
    address: { type: String },
    password: { type: String },
    status: Boolean,
    is_registered: Boolean,
    user_type: String
  });

module.exports = mongoose.model("usersignup", usersignup);  