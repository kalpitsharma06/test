const mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
// const MODALFUNC = require('./model_functions').functions;
let item = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    parent:{
        type:String,
    },
    vendorId: {type:String},
    products:[{
        
        Product_name: {
            type:String
        },
        Product_description:{
            type :String
        },
        price: { type:Number},
        quantity: {type:String},
        image: {type:String},
        type: {type:String},
        restro_name:{type:String},
        offer_price:{type:String},
    }
],
    extras:[{
        
    extras_name:String,
    extras_price:String
}],
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
    // {
    //     timestamps: {
    //         created_at: MODALFUNC.string_ts,
    //         updated_at: MODALFUNC.string_ts
    //     },
    // }
    );


module.exports.item = mongoose.model("item", item);
