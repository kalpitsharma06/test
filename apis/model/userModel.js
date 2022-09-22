const mongoose = require('mongoose');

let usersignup = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String },
  status: Boolean,
  is_registered: Boolean,
  type: String,
  address:String,
  postcode:String,
  city:String,
  phone:String,
  guest_id: { type: String },
  password: { type: String },

  address_book: [
    {
      address: { type: String },
      first_name: { type: String },
      last_name: { type: String },
      city: { type: String },
      postcode: { type: String },
      address_title: { type: String },

      mobile: { type: String },
    },
  ],

  stripe_id: {
    type: String,
  },
  merchantStripe_id: {
    type: String,
  },
  total_stripe_amount: {
    type: String,
    default: 0,
  },
  //save user encrypted card info for Stripe Payment getway
  stripe_card_data: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      number: String,
      brand: String,
      name: String,
      card_id: String,
      is_default: {
        type: Boolean,
        default: false,
      },
    },
  ],
  bank_data: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      account_holder_type: String,
      account_holder_name: String,
      routing_number: String,
      accountNumber: String,
      bank_name: String,
      bank_id: String,
      is_default: {
        type: Boolean,
        default: false,
      },
    },
  ],
  get_order_update_email: Boolean,
  get_order_update_text: Boolean,
  get_new_offers_email: Boolean,
  get_new_offers_text: Boolean,
});

module.exports = mongoose.model('usersignup', usersignup);
