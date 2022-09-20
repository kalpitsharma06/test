const mongoose = require('mongoose');
// const MODALFUNC = require('./model_functions').functions;
let ObjectId = mongoose.Types.ObjectId;
let Schema = mongoose.Schema;
// const crypto = require('crypto');
let cart = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'registerusers',
    },
    postcode:{
      type:Number},
    city:{
      type:String
    },

    address:{
      type:String},
   name:{
     type:String
   },
      vendorId:{
      type: Schema.Types.ObjectId,
      ref: 'registerusers',
    },
  
  
    restro_address:{
      type:String
    },
    Grand_total:{
      type:Number
    },
    
    products: [
        {
          restro_name:{
            type:String
          },
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
          subtotal:{type:Number},
          image:{type:String}
        }
      ],
      active: {
        type: Boolean,
        default: true
      },
}, {    
    timestamps: true
})
cart.methods.addToCart = function(category) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.categoryId.toString() === category._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        categoryId: category._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };
module.exports.cart = mongoose.model('cart', cart);