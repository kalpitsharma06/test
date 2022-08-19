const mongoose = require('mongoose');
// const con = require('../../database/db')

const savedcards = new mongoose.Schema({
   
user_id:{ type: mongoose.Types.ObjectId, ref: "usersignup" },
    account_holder_name: String,
    account_number: String,
    bank_name: String,
    ifsc_code :String,
    
    status: Boolean,
    is_registered: Boolean,
    user_type: String,
});

module.exports = mongoose.model('savedcards', savedcards);

