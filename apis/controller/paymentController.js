
  
const User = require('../model/userModel')
const savedCards = require('../model/savedcards')
const restaurant_model = require('../model/signup')
const additional_restroinof = require('../model/additionalinfo')
const subCategory = require('../../admin/model/subCategory')
const cartModel = require('../model/cart').cart
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
// const locationModel = require("../model/signup")
const jwt = require('jsonwebtoken')
const { find } = require('../model/signup');
const nodemailer = require('nodemailer');
const auth = require("../../services/auth")
var lodash = require('lodash');
var randomstring = require("randomstring");
const { result } = require('lodash')

let itemModel = require('../../apis/model/item').item;
let orderModel = require('../../apis/model/order').order;
const reportsModel = require("../../apis/model/report").reports
const stripe = require('../../functions/stripe');

  
  
exports.Default_card = async (req, res, next) => {
    var logindata = req.user;
    var card_id = req.body.card_id;
    console.log(logindata)
    User.find({ _id: ObjectId(logindata.id) }, (err, usedata) => {
      var stripe_id = usedata.stripe_id
      stripe.updateCustomerCard(stripe_id, card_id)
        .then(function () {
          User.update({
            _id: logindata.id,
            "stripe_card_data.is_default": true
          }, {
            $set: {
              "stripe_card_data.$.is_default": false
            }
          }, function (err) {
            User.update({
              _id: logindata.id,
              "stripe_card_data.card_id": card_id
            }, {
              $set: {
                "stripe_card_data.$.is_default": true
              }
            }, function (err) {
              return res.status(200).json({
                status: 200,
                Message: "Set as default",
              });
            });
          });
        }).catch(function (err) {
          console.log(err)
          return next(err);
        });
    })
 }

  exports.ListCard = async(req, res, next) => {
    var logindata = req.user;
    User.find({ email: logindata.email }, (err, userdata) => {
      // var array = userdata.map(function (obj) {
      //   return obj.stripe_card_data
      // });
      userdata.forEach(element => {
        var cardData = element.stripe_card_data

        console.log(userdata.stripe_card_data)
        return res.status(200).json({
          data: cardData,
          status: 200,
          message: "Card list loaded successfully",
          meta: req.phoneMeta,
        });
      });
    })

  }


  exports.AddCard = async(req, res, next) => {
    var reqdata = req.body;
    var logindata = req.user;
    // reqdata.number = reqdata.number.replace(/-/g, "");
    User.findOne({ _id: ObjectId(logindata.id) }, (err, userdata) => {
      var stripe_id = userdata.stripe_id
      // console.log(userdata.stripe_id)  
      console.log(stripe_id == undefined)
      if (stripe_id == undefined || stripe_id == "") {
        stripe.createCustomer({
          email: logindata.email,
        }).then(function (customer) {
          // if(req.headers["os"] == 'ios'){
          stripe.createCardToken(reqdata).then(function (token) {
            console.log("sadasdasd", customer, token)
            stripe.addSource(customer.id, token.id).then(function (source) {
              console.log('!!!!', source);
              User.update({
                _id: logindata.id
              }, {
                $set: {
                  "stripe_id": source.customer,
                },
                $push: {
                  "stripe_card_data": {
                    _id: ObjectId(),
                    number: "xxxx-xxxx-xxxx-" + source.last4,
                    brand: source.brand,
                    name: source.name,
                    card_id: source.id,
                    is_default: false
                  }
                }
              }, function (err) {
                if (err) {
                  stripe.deleteSource(
                    source.customer,
                    source.id).then(function () {
                      return next(err);
                    }).catch(function (err) {
                      return next(err);
                    })
                } else {
                  return res.status(200).json({
                    status: 200,
                    message: "Card added successfully",
                  });
                }
              });
            }).catch(function (err) {
              next(err)
              console.log(err)
            });
          }).catch(function (err) {
            next(err)
            console.log(err)
          });
          // }
          // else{
          //   stripe.addSource(customer.id, reqdata.token).then(function(source)  {
          //     console.log('!!!!',source);
          //     User.update({
          //       _id: logindata._id
          //     }, {
          //       $set: {
          //         "stripe_id": source.customer,
          //         profile_status: 'complete'
          //       },
          //       $push: {
          //         "stripe_card_data": {
          //           _id: ObjectId(),
          //           number: "xxxx-xxxx-xxxx-" + source.last4,
          //           brand: source.brand,
          //           name: source.name,
          //           card_id: source.id,
          //           is_default: false
          //         }
          //       }
          //     }, function(err) {
          //       if (err) {
          //         stripe.deleteSource(
          //           source.customer,
          //           source.id).then(function() {
          //             return next(err);
          //           }).catch(function(err) {
          //             return next(err);
          //           })
          //       } else {
          //         return res.status(200).json({
          //           data: {},
          //           reply: _d("card_added", "Card added successfully"),
          //           meta: req.phoneMeta
          //         });
          //       }
          //     });
          //   }).catch(function(err){
          //     next(err)
          //     console.log(err)
          //   });
          // }
        }).catch(function (err) {
          next(err);
        });

      } else {
        // if(req.headers["os"] == 'ios'){
        stripe.createCardToken(reqdata).then(function (token) {
          stripe.addSource(stripe_id, token.id).then(function (source) {
            console.log('!!!!', source);
            User.update({
              _id: logindata.id
            }, {
              $set: {
                "stripe_id": source.customer,
              },
              $push: {
                "stripe_card_data": {
                  _id: ObjectId(),
                  number: "xxxx-xxxx-xxxx-" + source.last4,
                  brand: source.brand,
                  name: source.name,
                  card_id: source.id,
                  is_default: false
                }
              }
            }, function (err) {
              if (err) {
                stripe.deleteSource(
                  source.customer,
                  source.id).then(function () {
                    return next(err);
                  }).catch(function (err) {
                    return next(err);
                  })
              } else {
                return res.status(200).json({
                  status: 200,
                  message: "Card added successfully",
                });
              }
            });
          }).catch(function (err) {
            console.log(err)
            next(err)
          });
        }).catch(function (err) {
          console.log(err)
          next(err)
        });

        // }
        // else{
        //   console.log(reqdata.token);
        //   stripe.addSource(logindata.stripe_id, reqdata.token).then(function(source){
        //     console.log('!!!!',source);
        //     User.update({
        //       _id: logindata._id
        //     }, {
        //       $set: {
        //         "stripe_id": source.customer,
        //         profile_status: 'complete'
        //       },
        //       $push: {
        //         "stripe_card_data": {
        //           _id: ObjectId(),
        //           number: "xxxx-xxxx-xxxx-" + source.last4,
        //           brand: source.brand,
        //           name: source.name,
        //           card_id: source.id,
        //           is_default: false
        //         }
        //       }
        //     }, function(err) {
        //       if (err) {
        //         stripe.deleteSource(
        //           source.customer,
        //           source.id).then(function() {
        //             return next(err);
        //           }).catch(function(err) {
        //             return next(err);
        //           })
        //       } else {
        //         return res.status(200).json({
        //           data: {},
        //           reply: _d("card_added", "Card added successfully"),
        //           meta: req.phoneMeta
        //         });
        //       }
        //     });
        //   }).catch(function(err) {
        //     console.log(err)
        //     next(err)
        //   });
        // }
      }
    })
  }


  exports.addBank = async(req, res, next) => {
    var logindata = req.user;
    var reqdata = req.body;
    User.findOne({ _id: ObjectId(logindata.id) }, (function (err, account) {
      // console.log(account.merchantStripe_id)
      stripe.createBankToken({
        id: logindata.id,
        account_holder_name: req.body.account_holder_name,
        routing_number: req.body.routing_number,
        account_number: req.body.account_number,
      }).then(function (token) {
        // console.log("asdasd",token)
        stripe.addAccount({
          id: "merchantStripe_id",
          token: token.id
        }).then(function (bank) {
          User.update({
            _id: logindata.id
          }, {
            $set: {
              is_verified:"true"
            },
            $push: {
              "bank_data": {
                _id: ObjectId(),
                account_holder_type: bank.account_holder_type,
                account_holder_name: bank.account_holder_name,
                routing_number: bank.routing_number,
                accountNumber: "xxxxxxxxxxxx" + bank.last4,
                bank_name: bank.bank_name,
                bank_id: bank.id,
                is_default: true
              }
            }
          }, function (err, vendordata) {
            if (err) {
              stripe.deleteAccount({
                id: logindata.stripe_id,
                token: token.id
              }).then(function (delBank) {
                return res.status(err.status || 203).json({
                  data: {},
                  message: err.message,
                  meta: req.phoneMeta
                });
              }).catch(function (err) {
                return res.status(err.status || 203).json({
                  data: {},
                  message: err.message,
                  meta: req.phoneMeta
                });
              })
            } else {
              return res.status(200).json({
                status:200,
                message: "Bank added successfully",
              });
            }
          });
        }).catch(function (err) {
          return next(err);

        });
      }).catch(function (err) {
        return next(err);
      });
    })
    )
  }

  exports.Login_stripe = async (req, res, next) => {

    login_data = req.user;
    stripe.createMerchant({
      email: login_data.email,
      first_name: login_data.first_name,
      last_name: login_data.last_name
    }).then(function (account) {
      console.log(account.url);
      var mydata = {
        stripe_id: account.id,
        stripeAccountUrl: account.url,
      }
      User.update({ _id: ObjectId(login_data.id), },
        {
          $set: {
            "merchantStripe_id": mydata.stripe_id
          }

        }, (function (err, account) {
          return res.status(200).json({
            data: mydata,
            status: 200,
            message: "login_successfully",
           
          });
        })
      )
    });

  }