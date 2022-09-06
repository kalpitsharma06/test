const User_signUp = require('../model/userModel');
const savedCards = require('../model/savedcards');
const restaurant_model = require('../model/signup');
const additional_restroinof = require('../model/additionalinfo');
const subCategory = require('../../admin/model/subCategory');
const cartModel = require('../model/cart').cart;
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
// const locationModel = require("../model/signup")
const jwt = require('jsonwebtoken');
const { find } = require('../model/signup');
const nodemailer = require('nodemailer');
const auth = require('../../services/auth');
var lodash = require('lodash');
var randomstring = require('randomstring');
const { result } = require('lodash');

let itemModel = require('../../apis/model/item').item;
let orderModel = require('../../apis/model/order').order;
const reportsModel = require('../../apis/model/report').reports;

var Secret_Key = 'sk_test_51LLAvFJ9nnMhlV7kVExDWv4r7aPrPKnGH7ArfRWJqUJuXtKxn7XmdkpMBSJWwTmEl29MyV0iS8ZuogM79HTnc8bV00Z75cWlY1'
 
const stripe = require('stripe')(Secret_Key)

exports.order_payment = async(req, res)=>{


   orderModel.findOne({ userId: ObjectId(id) }, async(err, orderdata) => {

 
  // Moreover you can take more details from user
  // like Address, Name, etc from form
   await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,  
      name: 'Madhav shridhar ',
      address: {
          line1: 'TC 9/4 Old MES colony',
          postal_code: '452331',
    
          city: 'Indore',
          state: 'Madhya Pradesh', 
          country: 'UsA',
      }
  })
  .then((customer) => { 

    
      return stripe.charges.create({
        amount: 2500,     // Charging Rs 25
        description: 'Food order',
        currency: 'USD',
        customer: customer.id
    });

  })
  .then((charge) => {
    res.status(200).json({
      status: true,
      message: 'payment successfull',
      results: charge,
    });// If no error occurs
  })
})
.catch((err) => {
  res.status(400).json({
    status: false,
    error: err,
    
  });      // If some error occurs
});
}


























