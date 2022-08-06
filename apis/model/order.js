const mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const MODALFUNC = require('./model_functions').functions;
let order = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    order_id:{
        type:String
    },
    transaction_id:{
        type:String
    },
    mobile:{
        type:String
    },
    transaction_status:{
        type:String
    },
    vendorID:{
        type: mongoose.Schema.Types.ObjectId
    },
    customerID:{
        type: mongoose.Schema.Types.ObjectId,
    },
    status : { type: String , default :'New'},
    restro_name:{
        type:String
      },
      restro_address:{
        type:String
      },
      restro_image:{
        type:String
      },
      products: [
          {
            productId:{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'item',
              required: true
            },    
            quantity:{type: Number} ,
            name: {type:String},
            price: {type:Number},
            offer_price :{type: Number},
            type:{type:String},
          }
        ],
    payment:{
        type:String
    },
    type:{
        type:String
    },
    subtotal:{
        type:String
    },


   }, {
    timestamps: {
        created_at: MODALFUNC.string_ts,
        updated_at: MODALFUNC.string_ts
    },
},
    {
    versionKey: false,
    timestamps: true
});


module.exports.order = mongoose.model("order", order);
