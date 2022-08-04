const mongoose = require('mongoose');
const con = require('../../database/db')

var additional_info = new mongoose.Schema({
     restaurant_id:{ type: mongoose.Types.ObjectId, ref: "signup" },
     restaurant_name: {type:String},
    rating:{type:String},
timmings:[{
        
        monday_open: {
            type: String 
        },
        monday_close:{
            type :String
        },
        tuesday_open: { type:String},
        tuesday_open: {type:String},
        thursday_open: {type:String},
        thursday_close: {type:String},
        friday_open:{type:String},
        friday_close:{type:String},
        saturday_open:{type:String},
        saturday_close:{type:String},
        sunday_open:{type:String},
        sunday_close:{type:String},
    }
],

    
});

module.exports = mongoose.model('additional_info', additional_info);

