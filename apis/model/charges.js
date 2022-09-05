const mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const MODALFUNC = require('./model_functions').functions;
let charges = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    ch_id:{
        type:String,
    },
    amount_capture:{
        type:Number,
    },
    balance_transaction:{
        type:String,
    },
    network_status:{
        type:String,
    },
    receipt_url: {type:String},
    data:{tyoe:Object}
 
    // name: String,
    // status: String,
    // status: {
    //     type: Number,
    // },

    // menu_type: {
    //     type: String
    // },
    // menu_description: {
    //     type: String
    // },
//     price: {
//         type: String,
//     },
//     quantity: {
//         type: String,
//     },
    // image: {
    //     type: String,
    //     required:"Required",

    // },
  
//     vendorId: {
//         type: Schema.Types.ObjectId,
//         ref: 'registerusers',
//     },
//     type:{
//         type:String,
//     },
// restro_name:{
//     type:String,
// },

},
    {
        timestamps: {
            created_at: MODALFUNC.string_ts,
            updated_at: MODALFUNC.string_ts
        },
    });


module.exports.combo = mongoose.model("combo", combo);
