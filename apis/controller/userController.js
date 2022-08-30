require('dotenv').config();
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
const stripe = require('../../functions/stripe');


//USER SING UP
exports.addUser = async function (req, res, next) {
  var address = req.body.address;
  var city = req.body.city;
  var postcode = req.body.postcode;
  var address_title = req.body.address_title;
  var mobile = req.body.mobile;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const singupRecords = new User_signUp({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,

    password: hashedPassword,
    status: true,
    is_registered: true,
    type: 'user',

    address_book: { address, city, postcode, address_title, mobile },
  });
  try {
    const check = await User_signUp.findOne({ email: req.body.email });
    if (check !== null) {
      res.status(400).json('Email Already Registered !');
    } else {
      await singupRecords.save();
      res.status(200).json({
        status: true,
        message: 'Successfully Signed up',
        results: singupRecords,
      });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

//Update User Details
exports.updateUser = async (req, res) => {
  const id = req.user.id;
  console.log(id);
  try {
    const updateUserDetails = await User_signUp.findByIdAndUpdate(
      req.params.id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        postcode: req.body.postcode,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message: 'Successfully userdetails details',
      results: updateUserDetails,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Get user by id
exports.get_usersbyid = async (req, res) => {
  var id = req.user.id;
  try {
    const result = await User_signUp.findOne({ _id: id });
    res.status(200).json({
      status: true,
      message: 'Successfully Fetched  users',

      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const result = await User_signUp.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: 'Successfully Deleted ',
      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// update the password
exports.changePassword = async (req, res) => {
  try {
    const databasePassword = await signUp.findById(req.params.id);
    const validPassword = await bcrypt.compare(req.body.currPassword, databasePassword.password);

    if (validPassword) {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      const results = await signUp.findByIdAndUpdate(req.params.id, { password: hashedPassword });
      res.status(200).json({
        status: true,
        message: 'Successfully Updated Password',
        results: results,
      });
    } else {
      res.status(400).json({
        status: false,
        message: 'Entered Current Password is wrong',
      });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};
// Login
exports.logIn = async (req, res) => {
  try {
    const check = await User_signUp.findOne({ email: req.body.email });
    if (check === null) {
      res.status(400).json({
        status: false,
        message: 'Email is wrong',
      });
    } else {
      const validPassword = await bcrypt.compare(req.body.password, check.password);
      if (validPassword) {
        const payload = {
          email: req.body.email,
          id: check.id,
        };
        // console.log(check.id)
        // const payload = {
        //     email: req.body.email,
        //     password: req.body.password,
        //     id:check.id

        // };
        let envsecret = auth.getSecretToken();
        let token = jwt.sign(payload, envsecret);
        res.cookie('access_token', token, {
          httpOnly: true,
        });

        res.status(200).json({
          status: true,
          message: 'Successfully Signed in',
          user_type: check.user_type,
          token: token,
          result: check,
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'password is wrong',
        });
      }
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

exports.guest_login = async (req, res) => {
  var guest_id = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });
  var guest = 'guest';
  var guestId = 'guest-' + guest_id;
  var guestdata = {
    guest_id: guestId,
    type: guest,
  };
  var New_guest = new User_signUp(guestdata);
  New_guest.save(function (err, new_data) {
    if (err) return next(err);
    else {
      var userid = new_data._id;
      const payload = {
        id: userid,
        guest_id: guestId,
        type: guest,
      };
      let envsecret = auth.getSecretToken();
      let token = jwt.sign(payload, envsecret);
      res.cookie('access_token', token, {
        httpOnly: true,
      });
    }
    res.status(200).json({
      status: true,
      data: new_data,
      message: ' Guest loggedin',
    });
  });
};

exports.Searchby_main = async (req, res) => {
  console.log(req.params);
  try {
    if (req.body) {
      let data = await restaurant_model
        .find({
          $or: [
            { pincode: { $regex: req.body.key } },
            { restaurant_name: { $regex: req.body.key } },
            { restaurant_address: { $regex: req.body.key } },
            { city: { $regex: req.body.key } }, { primary_cuisine: { $regex: req.body.key } },
            { secoundry_cuisine: { $regex: req.body.key } }
          ],
        })
        .select({ restaurant_name: 1, restaurant_address: 1,restaurant_logo:1,});
      if (data.length > 0) {
        res.status(200).json({
          status: 'true..',
          result: data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'No resrautrants available',
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: 'No resrautrants avialable',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'No resrautrants avialable',
    });
  }
};

exports.Searchby_mealtimming = async (req, res) => {
  try {
    let data = await restaurant_model
      .find({
        $or: [{ meal_timming: { $regex: req.params.key } }],
      })
      .select({ restaurant_name: 1, restaurant_address: 1 });
    if (data.length > 0) {
      res.status(200).json({
        status: 'true..',
        result: data,
      });
    } else {
      res.status(400).json({
        status: false,
        message: 'No resrautrants available for this time shift ',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'No resrautrants available for this time shift ',
    });
  }
};

exports.suggestion_main = async (req, res) => {
  console.log(req.params);
  try {
    if (req.body) {
      let data = await restaurant_model
        .find({
          $or: [
            { pincode: { $regex: req.body.key } },
            { restaurant_name: { $regex: req.body.key } },
            { restaurant_address: { $regex: req.body.key } },
            { city: { $regex: req.body.key } }, { primary_cuisine: { $regex: req.body.key } },
            { secoundry_cuisine: { $regex: req.body.key } }
          ],
        })
        .select({ restaurant_name: 1});
      if (data.length > 0) {
        res.status(200).json({
          status: 'true..',
          result: data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'No resrautrants available',
        });
      }
    } else {
      res.status(400).json({
        status: false,
        message: 'No resrautrants avialable',
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'No resrautrants avialable',
    });
  }
};

exports.getrestro_byid = async (req, res) => {
  let payload = req.params;
  payload.userId = req.params.id;

  restaurant_model.findById(
    { _id: payload.userId },
    (err, userdetails) => {
      console.log(userdetails);

      if (userdetails) {
        res.status(200).json({
          status: 'true..',
          result: userdetails,
        });
      } else {
        res.status(400).json({
          status: 'false',
          result: 'No records',
        });
      }
    },
    {
      // imageData:userimage,
    }
  );
};
//

exports.logout = (req, res) => {
  return res.clearCookie('access_token').status(200).json({ message: 'Successfully logged out  🍀' });
};

//  add cart

exports.cart = async (req, res) => {
  try {
    const { productId } = req.body;
    let quantity;
    var userId = req.user.id;
    var vendorId;
    var subtotal;

    let restro_address;
    let restro_name;
    let price;
    let Product_name;
    let offer_price;

    let Grand_total;
    // console.log(productId);

    itemModel.findOne({ _id: ObjectId(productId) }, async (err, productdata) => {
      // console.log(productdata);
      quantity = req.body.quantity;
      price = productdata.price;
      name = productdata.Product_name;
      vendorId = productdata.vendorId;
      restro_name= productdata.restro_name;
      offer_price = productdata.offer_price;
      subtotal = price * quantity;
      Grand_total = subtotal;

      console.log(productdata.restro_name)

      let cart = await cartModel.findOne({ userId });
      cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {
        // console.log(vendorId);

        if (data) {
          console.log(data.vendorId)
          console.log(ObjectId(vendorId))
          if (data.vendorId.toString() != ObjectId(vendorId).toString() ){
            res.status(201).json({
              msg: 'Kindly clear the cart to add item from  different restaurant ',
              status: false,
             
            });
          }
         
          data.products.map((p) => {
            return (Grand_total = Grand_total + p.subtotal);  
          });

          //cart exists for user
          let itemIndex = cart.products.findIndex((p) => p.productId == productId);

          if (quantity <= 0) {
            console.log(data.products[itemIndex].subtotal);
            console.log(Grand_total, '1');
            cart.Grand_total = Grand_total - data.products[itemIndex].subtotal;
            console.log(cart.Grand_total, '2');

            cart.save();
            cartModel.updateOne(
              { userId: userId },
              { $pull: { products: { productId: productId } } },
              (err, modeldata) => {
                if (err) {
                  res.status(201).json({
                    msg: 'no data exist',
                    status: false,
                    err: err.message,
                  });
                } else {
                  res.status(200).json({
                    msg: 'Delted item  successfully',
                    status: true,
                    data: modeldata,
                  });
                }
              }
            );
          } else {
            if (itemIndex > -1) {
              //product exists in the cart, update the quantity
              let productItem = cart.products[itemIndex];
              //  console.log(productItem)
              let newQuantity = quantity;
              // console.log(price)
let old_subtotal =cart.products[itemIndex].subtotal;
              let newSubtotal = cart.products[itemIndex].subtotal;
              console.log(newSubtotal,"old subtotal")
              newSubtotal = newQuantity * price;
              //  console.log(newSubtotal)

              productItem.name = productItem.quantity = newQuantity;
              productItem.subtotal = newSubtotal;
              productItem.price = price;
              productItem.restro_name = restro_name;

              subtotal = price * newQuantity;
              productItem.offer_price = offer_price;

              cart.products[itemIndex] = productItem;
              // console.log(subtotal)
              // Grand_total= subtotal
              Grand_total=subtotal
              console.log(Grand_total,"latest total")
              data.products.map((p) => {
                console.log(p.subtotal) 
                return (Grand_total = Grand_total + p.subtotal);  
              });
              console.log(old_subtotal,"old sub")
              Grand_total=  Grand_total-old_subtotal
              console.log(Grand_total,"final  value")

    //  cart.products.push({ productId, quantity, name, price, offer_price, type });
              cart.Grand_total = Grand_total;
            } else {
              // console.log(quantity)
              cart.Grand_total = Grand_total;
            

              cart.products.push({ productId, quantity, name, price, offer_price, subtotal,restro_name });
            }

            cart = cart.save();
            return res.status(200).json({
              status: 200,
              message: 'Your cart prducts quatity updated successfully.',
            });
          }
        } else {
          if (quantity > 0) {
            let newCart = cartModel.create({
              userId,
              vendorId,
              
             
              Grand_total,

              products: [{ productId, quantity, name, price, offer_price, subtotal, restro_address,restro_name }],
            });
          } else {
            newCart = cartModel.create({
              userId,
              vendorId,
              restro_name,
           
              Grand_total,
            });
          }
          // console.log(newCart)
          return res.status(200).json({
            status: 200,
            message: 'Your cart created successfully. ',
          });
        }
        {
        }
      });
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('Something went wrong');
  }
};


// new
// exports.cart = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     let quantity;
//     var userId = req.user.id;
//     var vendorId;
//     var subtotal;

//     let restro_address;
//     let restro_name;
//     let price;
//     let Product_name;
//     let offer_price;

//     let Grand_total;
//     console.log(productId);

//     itemModel.findOne({ _id: ObjectId(productId) }, async (err, productdata) => {
//       console.log(productdata);
//       quantity = req.body.quantity;
//       price = productdata.price;
//       Product_name = productdata.Product_name;
//       vendorId = productdata.vendorId;
//       offer_price = productdata.offer_price;
//       subtotal = req.body.subtotal;
//       Grand_total = req.body.Grand_total;

//       let cart = await cartModel.findOne({ userId });
//       cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {
//         console.log(vendorId);

//         if (data) {
//           //cart exists for user
//           let itemIndex = cart.products.findIndex((p) => p.productId == productId);

//           // console.log(itemIndex)
//           // console.log(quantity)
//           // console.log(itemIndex)
//           // if (itemIndex !== -1 && quantity <= 0) {
//           //     cart.products.splice(itemIndex, 0);
//           //     if (cart.products.length == 0) {
//           //         cart.quantity = 0;
//           //     } else {
//           //         cart.price = cart.products.map(products => products.price).reduce((acc, next) => acc + next);
//           //     }
//           // }
//           if (itemIndex > -1) {
//             //product exists in the cart, update the quantity
//             let productItem = cart.products[itemIndex];
//             //  console.log(cart)

//             //  console.log(newSubtotal)

//             productItem.quantity = quantity;
//             productItem.subtotal = subtotal;
//             productItem.price = price;
//             subtotal = subtotal;
//             productItem.offer_price = offer_price;

//             cart.products[itemIndex] = productItem;
//             //  cart.products.push({ productId, quantity, name, price, offer_price, type });
//             cart.Grand_total = Grand_total;
//           } else {
//             cart.Grand_total = Grand_total;

//             cart.products.push({ productId, quantity, Product_name, price, offer_price, subtotal });
//           }

//           cart = cart.save();
//           return res.status(200).json({
//             status: 200,
//             message: 'Your cart prducts quatity updated successfully.',
//           });
//         } else {
//           //     restro_address = restrodata.restro_address;
//           //  restro_name = restrodata.restro_name;
//           //no cart for user, create new cart
//           const newCart = cartModel.create({
//             userId,
//             vendorId,
//             restro_name,
//             restro_address,
//             Grand_total,

//             products: [{ productId, quantity, Product_name, price, offer_price, subtotal }],
//           });
//           // console.log(newCart)
//           return res.status(200).json({
//             status: 200,
//             message: 'Your cart created successfully. ',
//             result: newCart,
//           });
//         }
//       });
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Something went wrong');
//   }
// };

exports.cart_list = async (req, res) => {
  var id = req.user.id;
  cartModel.find({ userId: ObjectId(id) }, (err, cartdata) => {
    let productId = cartdata.map((p) => p.products);
    let quantity = cartdata.map((a) => a.quantity);
    let pro = cartdata.map((p) => p.products);
    //     let newArray = lodash.flatten(pro);
    //  console.log("pro", pro)
    //      console.log("qwe", quantity)

    // var vendorId = result.toString()
    // console.log(vendorId)
    // itemModel.findOne({ vendorId: vendorId }, (err, itemdata) => {
    if (cartdata.length == 0) {
      return res.status(200).json({
        status: 401,
        message: 'No item available in your cart',
      });
    } else {
      return res.status(200).json({
        status: 200,
        data: cartdata[0],
        message: 'cart listing loaded',
      });
    }
    // })
  });
};
exports.clear_cart = async (req, res) => {
  try {
    const id = req.params.id;
    const { productId_no } = req.body;

    //   console.log(data)
    cartModel.findOne({ _id: id }, (err, cartdata) => {
      console.log(cartdata, 'dddddddd');
      var products = cartdata.products;

      if (products.length == 1) {
        cartModel.findOneAndDelete({ _id: ObjectId(id) }, (err, cartdata) => {
          return res.status(200).json({
            status: 200,
            message: 'Your cart is empty',
          });
        });
      } else {
        cartdata.products.splice(productId_no, 1);
        cartdata = cartdata.save();
        return res.status(200).json({
          status: 200,
          message: 'Your quantity reduced successfull.',
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: 'something went wrong',
    });
  }
};
exports.nearbyRestro = async (req, res) => {
  var reqdata = req.body;
  var lat = reqdata.lat;
  var long = reqdata.long;
  console.log(Number(lat));
  var userId = [];
  restaurant_model.aggregate(
    [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(long), Number(lat)],
          },
          maxDistance: 3002186.9,
          spherical: true,

          distanceField: 'restroDistance',
        },
      },
      { $limit: 5 },
    ],
    function (err, nearbyRestro) {
      console.log(err);
      if (nearbyRestro) {
        return res.status(200).json({
          success: true,
          status: 200,
          message: 'Nearby restaurant ',
          data: nearbyRestro,
        });
      } else {
        return res.status(200).json({
          success: false,
          status: 401,
          message: 'No nearby restaurant',
          err: err.message,
        });
      }
    }
  );
};
exports.create_order = (req, res) => {
  try {
    var reqdata = req.body;
    var order = randomstring.generate({
      length: 6,
      charset: 'numeric',
    });
    var order_id = 'justeat' + order;

    var transaction_id = randomstring.generate({
      length: 9,
      charset: 'numeric',
    });
    var transaction_status = reqdata.transaction_status;
    // console.log(req.user)
    var id1 = req.user.id;
    var id = req.body.id;
    console.log(id);
    User_signUp.findOne({ _id: id1 }, (err, userdata) => {
      //    console.log(userdata)
      var first_name = userdata.firstname;
      var last_name = userdata.lastname;
      var customerID = userdata._id;
      var restro_address = userdata.address;
      cartModel.findOne({ _id: id }, (err, cartdata) => {
        console.log(cartdata);
        if (err) throw err;
        if (cartdata) {
          console.log(cartdata);
          var restro_name = cartdata.restro_name;

          var vendorID = cartdata.vendorId;
          var payment = reqdata.payment;
          var subtotal = reqdata.subtotal;
          var products = cartdata.products;
          // var errors = req.validationErrors();
          restaurant_model.findOne({ _id: vendorID }, (err, vendordata) => {
            if (vendordata) {
              var mobile = vendordata.mobile;
              var restro_image = vendordata.image;
              console.log(vendordata);
              console.log(mobile);
              let order = new orderModel();
              (transaction_id = transaction_id),
                (order.transaction_status = transaction_status),
                (order.order_id = order_id),
                (order.first_name = first_name),
                (order.last_name = last_name),
                (order.restro_name = restro_name),
                (order.restro_address = restro_address),
                (order.mobile = mobile),
                (order.restro_image = restro_image),
                (order.payment = payment),
                (order.products = products);
              (order.vendorID = vendorID),
                (order.customerID = customerID),
                (order.subtotal = subtotal),
                (order.products = products);
              var payload = {
                first_name: first_name,
                last_name: last_name,
                restro_name: restro_name,
                restro_address: restro_address,
                restro_image: restro_image,
                mobile: mobile,
                payment: payment,
                subtotal: subtotal,
                order_id: order_id,
                transaction_id: transaction_id,
                transaction_status: transaction_status,
                vendorID: vendorID,
                customerID: customerID,
                products: products,
              };
            } else {
              return res.status(400).json({
                success: false,
                message: 'Restaurant not found',
              });
            }
            var NewTicket = new orderModel(payload);
            NewTicket.save(function (err, obj) {
              // cartModel.deleteOne({ _id: ObjectId(id) }, (err, cartdata) => {
              if (err) throw err;
              return res.status(200).json({
                success: true,
                message: 'order created successfully',
                payload: payload,
              });
            });
          });
          // })
        } else {
          return res.status(400).json({
            success: false,
            message: 'No order in cart',
          });
        }
      });
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

exports.create_order_guest = (req, res) => {
  var reqdata = req.body;
  let guest_id = req.body.guest_id;
  var order_id = randomstring.generate({
    length: 6,
    charset: 'numeric',
  });

  var transaction_id = randomstring.generate({
    length: 9,
    charset: 'numeric',
  });
  var transaction_status = 'complete';
  // console.log(req.user)

  console.log(req.body.guest_id, 'jjjjj');
  cartModel.findOne({ _id: guest_id }, (err, cartdata) => {
    console.log(cartdata);
    if (err) throw err;
    if (cartdata) {
      // console.log(cartdata)
      var restro_name = cartdata.restro_name;
      var restro_address = cartdata.restro_address;
      var vendorID = cartdata.vendorId;
      var payment = reqdata.payment;
      var subtotal = reqdata.subtotal;
      var products = cartdata.products;
      var first_name = req.body.first_name;
      var last_name = req.body.last_name;
      var email = req.body.email;

      var restro_name = restro_name;
      var restro_address = restro_address;
      var mobile = req.body.mobile;
      var address = req.body.address;
      var city = req.body.city;

      var delivery_time = req.body.delivery_time;
      var leave_note = req.body.leave_note;
      var postcode = req.body.postcode;
      // var errors = req.validationErrors();
      restaurant_model.findOne({ _id: vendorID }, (err, vendordata) => {
        var mobile = vendordata.mobile;
        var restro_image = vendordata.image;
        console.log(req.body);
        console.log(mobile);
        let order = new orderModel();
        (order.transaction_id = transaction_id),
          (order.transaction_status = transaction_status),
          (order.order_id = order_id),
          (order.first_name = first_name),
          (order.last_name = last_name),
          (order.email = email),
          (order.restro_name = restro_name),
          (order.restro_address = restro_address),
          (order.mobile = mobile),
          (order.address = address),
          (order.city = city),
          (order.delivery_time = delivery_time),
          (order.leave_note = leave_note),
          (order.postcode = postcode),
          (order.restro_image = restro_image),
          (order.payment = payment),
          (order.products = products);
        (order.vendorID = vendorID),
          //     order.customerID = customerID,
          (order.subtotal = subtotal),
          (order.products = products);
        const payload = {
          first_name: first_name,
          last_name: last_name,
          restro_name: restro_name,
          restro_address: restro_address,
          restro_image: restro_image,
          mobile: mobile,
          email: email,
          address: address,
          city: city,

          delivery_time: delivery_time,
          leave_note: leave_note,
          postcode: postcode,
          payment: payment,
          subtotal: subtotal,
          order_id: order_id,
          transaction_id: transaction_id,
          transaction_status: transaction_status,
          vendorID: vendorID,
          // customerID: customerID,
          products: products,
        };
        var NewTicket = new orderModel(payload);
        NewTicket.save(function (err, obj) {
          cartModel.deleteOne({ _id: ObjectId(guest_id) }, (err, cartdata) => {
            if (err) throw err;
            return res.status(200).json({
              success: true,
              message: 'order created successfully for Guest  ',
              payload: payload,
            });
          });
        });
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'No order in cart',
      });
    }
  });
};
exports.order_listing = (req, res) => {
  var id = req.user.id;
  orderModel.find({ customerID: id }, (err, order_data) => {
    var userorderr = order_data.reverse();
    var userorder = order_data;

    if (order_data.length == 0) {
      return res.status(200).json({
        success: true,
        status: 201,
        message: 'You have no orders',
      });
    } else {
      return res.status(200).json({
        success: true,
        data: userorder,
        status: 200,
        message: 'order listing successfully',
      });
    }
  });
};
exports.report = (req, res, next) => {
  var reqdata = req.body;
  const { user } = req;
  var id = user.id;
  // console.log(user)
  User_signUp.find({ _id: id }, (err, user_data) => {
    let moneyheist_obj = Object.assign({}, user_data);
    // console.log(moneyheist_obj)

    //  console.log(user_data[0].firstname)
    let firstname = user_data[0].firstname;
    let lastname = user_data[0].lastname;
    let email = user_data[0].email;
    console.log(firstname);
    var issue = reqdata.issue;
    var description = reqdata.description;
    let report = new reportsModel();
    (report.firstname = firstname),
      (report.lastname = lastname),
      (report.email = email),
      (report.issue = issue),
      (report.description = description);
    const payload = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      issue: issue,
      description: description,
    };
    var NewTicket = new reportsModel(payload);
    NewTicket.save(function (err, obj) {
      if (err) throw err;
      return res.status(200).json([
        {
          success: true,
          status: 200,
          message: 'Report Generated successfully',
          payload: NewTicket,
        },
      ]);
    });
  });
};

//USER CARD ADD
exports.Addcard = async function (req, res, next) {
  const id = req.user.id;
  const cardRecords = new savedCards({
    account_holder_name: req.body.account_holder_name,

    account_number: req.body.account_number,
    bank_name: req.body.bank_name,
    ifsc_code: req.body.ifsc_code,
    status: true,
    is_registered: true,
    type: 'user',
    user_id: id,
  });

  try {
    const check = await savedCards.findOne({ account_number: req.body.account_number });
    console.log(check);
    if (check) {
      res.status(400).json('This account number is Already Registered !');
    } else {
      await cardRecords.save((err, rows) => {
        if (err) throw err;
        res.status(200).json({
          status: true,
          message: 'Successfully Added account',
          results: cardRecords,
        });
      });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

//Update card Details
exports.updateCard = async (req, res) => {
  const id = req.user.id;
  // console.log(id)
  try {
    var account_holder_name = req.body.account_holder_name;

    //          account_number = req.body.account_number,
    //           bank_name = req.body.bank_name,
    //           ifsc_code = req.body.ifsc_code,

    //           is_registered = true,
    //           type = 'user',
    //           user_id =id

    // }

    const payload = {
      account_holder_name: account_holder_name,

      account_number: req.body.account_number,
      bank_name: req.body.bank_name,
      ifsc_code: req.body.ifsc_code,
      status: true,
      is_registered: true,
      type: 'user',
      user_id: id,
    };
    console.log(payload);
    const updatecardDetails = await savedCards.findByIdAndUpdate(req.params.id, payload);
    console.log(updatecardDetails, 'ffffkkkk');
    res.status(200).json(
      {
        status: true,
        message: 'Successfully updated details',
        results: payload,
      },
      { new: true }
    );
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Delete card
exports.deleteCard = async (req, res) => {
  try {
    const result = await savedCards.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: true,
      message: 'Successfully Deleted ',
      results: result,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

exports.contactPreference = async (req, res) => {
  const id = req.user.id;
  // console.log(id)
  try {
    const payload = {
      get_order_update_email: req.body.get_order_update_email,

      get_order_update_text: req.body.get_order_update_text,
      get_new_offers_email: req.body.get_new_offers_email,
      get_new_offers_text: req.body.get_new_offers_text,

      status: true,
      is_registered: true,
      type: 'user',
      user_id: id,
    };
    console.log(payload);
    const updatecardDetails = await User_signUp.findByIdAndUpdate(id, payload);
    console.log(updatecardDetails, 'ffffkkkk');
    res.status(200).json({
      status: true,
      message: 'Successfully updated details',
      results: payload,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

//ADD ADDRESSS
exports.add_addressbook = async function (req, res, next) {
  var address = req.body.address;
  var city = req.body.city;
  var postcode = req.body.postcode;
  var address_title = req.body.address_title;
  var mobile = req.body.mobile;
  var id = req.user.id;
  try {
    User_signUp.findOne({ _id: id }, async (err, userdata) => {
      if (userdata) {
        await userdata.address_book.push({ address, city, postcode, address_title, mobile });
        userdata.save();
        res.status(200).json({
          status: true,
          message: 'Successfully Signed up',
          results: userdata,
        });
      }
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// DELETE ADDRESS
exports.delete_address = async (req, res) => {
  const id = { _id: req.user.id };
  const address_id = req.params.id;

  //    const id = req.user.id
  console.log(id);
  console.log(req.params.id);

  User_signUp.updateOne(id, { $pull: { address_book: { _id: address_id } } }, (err, data) => {
    if (err) {
      res.status(200).json({
        msg: 'no data exist',
        status: false,
        err: err.message,
      });
    } else {
      res.status(200).json({
        msg: 'Address Deleted successfully',
        status: true,
        data: data,
      });
    }
  });

  //   })
};
// EDIT ADDRESS
exports.edit_address = async function (req, res, next) {
  const id = req.user.id;
  const address_id = req.params.id;

  var address = req.body.address;
  var city = req.body.city;
  var postcode = req.body.postcode;
  var address_title = req.body.address_title;
  var mobile = req.body.mobile;

  //    const id = req.user.id
  console.log(id);
  console.log(req.params.id);

  User_signUp.updateOne(
    { _id: ObjectId(id), 'address_book._id': ObjectId(address_id) },
    {
      $set: {
        'address_book.$.city': city,
        'address_book.$.postcode': postcode,
        'address_book.$.address_title': address_title,
        'address_book.$.mobile': mobile,
        'address_book.$.address': address,
      },
    },

    (err, data) => {
      if (err) {
        res.status(200).json({
          msg: 'Something went wrong',
          status: false,
          err: err.message,
        });
      } else {
        res.status(200).json({
          msg: 'Address updated successfully',
          status: true,
          data: data,
        });
      }
    }
  );
};

// ADD FEEDBACK

exports.add_feedback = async function (req, res, next) {
  var feedback = req.body.feedback;
  var rating = req.body.rating;
  var order_id = req.body.order_id;
  var user_id = req.user.id;
  var total_reviews = 1;
  var final_rating = 0;
  var sum_rating = 0;

  var id = req.params.id;
  try {
    additional_restroinof.findOne({ restaurant_id: id }, async (err, restrodata) => {
      if (restrodata) {
        restrodata.feedback.push({ feedback, rating, order_id, user_id });
        total_reviews = restrodata.feedback.length;

        restrodata.feedback.map((p) => {
          return (sum_rating = sum_rating + p.rating);
        });

        restrodata.final_rating = sum_rating / total_reviews;
        restrodata.total_reviews = total_reviews;
        await restrodata.save();

        res.status(200).json({
          status: true,
          message: 'Feedback successfully submitted',
          results: restrodata,
        });
      } else {
        res.status(400).json({
          status: true,
          message: 'Restaurant not found',
          results: restrodata,
        });
      }
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

// exports.cart =  async (req, res) => {
//     const { productId, name, price, offer_price, type } = req.body;
//     let quantity = req.body.quantity
//     var userId = req.user.id;
//     var vendorId = req.body.vendorId;
//     try {
//         // let cart = await cartModel.find();
//         let cart = await cartModel.findOne({ userId });
//         cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {

//             if (data == null) {
//                 restaurant_model.findOne({ _id: ObjectId(vendorId) }, (err, restrodata) => {
//                     if (restrodata == null) {
//                         return res.status(200).json({
//                             status: 201,
//                             message: " No restaurant found "
//                         });
//                     }
//                     var restro_address = restrodata.restro_address;
//                     var restro_name = restrodata.restro_name;
//                     if (data) {
//                         //cart exists for user
//                         let itemIndex = cart.products.findIndex(p => p.productId == productId);

//                         console.log(itemIndex)
//                         // console.log(itemIndex)
//                         // console.log(quantity)
//                         // console.log(itemIndex)
//                         // if (itemIndex !== -1 && quantity <= 0) {
//                         //     cart.products.splice(itemIndex, 0);
//                         //     if (cart.products.length == 0) {
//                         //         cart.quantity = 0;
//                         //     } else {
//                         //         cart.price = cart.products.map(products => products.price).reduce((acc, next) => acc + next);
//                         //     }
//                         // }
//                         if (itemIndex > -1) {
//                             //product exists in the cart, update the quantity
//                             let productItem = cart.products[itemIndex];
//                             // console.log(cart.products[itemIndex],"ggg")
//                             productItem.quantity = quantity;
//                             productItem.price = price;
//                             productItem.offer_price = offer_price;
//                             productItem.type = type;
//                             cart.products[itemIndex] = productItem;
//                              cart.products.push({ productId, quantity, name, price, offer_price, type });
//                         } else {
//                             //product does not exists in cart, add new item
//                             cart.products.push({ productId, quantity, name, price, offer_price, type });
//                         }
//                         cart = cart.save();
//                         return res.status(200).json({
//                             status: 200,
//                             message: "Your cart updated successfully. added new item 1 "
//                         });
//                     } else {
//                         //no cart for user, create new cart
//                         const newCart = cartModel.create({
//                             userId,
//                             vendorId,
//                             restro_name,
//                             restro_address,
//                             products: [{ productId, quantity, name, price, offer_price, type }]
//                         });
//                         return res.status(200).json({
//                             status: 200,
//                             message: "Your cart created successfully. created new cart 2"
//                         });
//                     }
//                 })
//             } else {
//                 cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {
//                     var cart_restro = data.restro_name;
//                     restaurant_model.findOne({ _id: ObjectId(vendorId) }, (err, restrodata) => {
//                         var restro_address = restrodata.restro_address;
//                         var restro_name = restrodata.restro_name;
//                         if (cart_restro == restrodata.restro_name) {
//                             if (cart) {
//                                 console.log(cart)
//                                 let itemIndex = cart.products.findIndex(p => p.productId == productId)
//                                 // console.log(cart.products)
//                                 // console.log(itemIndex)

//                                 console.log(productId)
//                                 // console.log(itemIndex)
//                                 // console.log(quantity)
//                                 // console.log(itemIndex)
//                                 // if (itemIndex !== -1 && quantity <= 0) {
//                                 //     cart.products.splice(itemIndex, 0);
//                                 //     if (cart.products.length == 0) {
//                                 //         cart.quantity = 0;
//                                 //     } else {
//                                 //         cart.price = cart.products.map(products => products.price).reduce((acc, next) => acc + next);
//                                 //     }
//                                 // }
//                                 if (itemIndex > -1) {

//                                     //product exists in the cart, update the quantity
//                                     let productItem = cart.products[itemIndex];
//                                     var newQuantity = quantity++
//                                     productItem.quantity = newQuantity;
//                                     console.log(productItem)
//                                     productItem.price = price;
//                                     productItem.offer_price = offer_price;
//                                     productItem.type = type;
//                                     cart.products[itemIndex] = productItem;
//                                 } else {
//                                     //product does not exists in cart, add new item
//                                     cart.products.push({ productId, quantity, name, price, offer_price, type });
//                                 }
//                                 cart = cart.save();
//                                 return res.status(200).json({
//                                     status: 200,
//                                     message: "Your cart updated successfully. added new ite m  3"
//                                 });
//                             } else {
//                                 //no cart for user, create new cart
//                                 const newCart = cartModel.create({
//                                     userId,
//                                     vendorId,
//                                     restro_name,
//                                     restro_address,
//                                     products: [{ productId, quantity, name, price, offer_price, type }]
//                                 });
//                                 return res.status(200).json({
//                                     status: 200,
//                                     message: "Your cart created successfully. no cart for user created new cart 4"
//                                 });
//                             }
//                         } else {
//                             cartModel.findOne({ vendorId: ObjectId(vendorId) }, (err, cartdata) => {
//                                 cartModel.deleteOne({ userId: ObjectId(userId) }, (err, cartdata) => {
//                                     const newCart = cartModel.create({
//                                         userId,
//                                         vendorId,
//                                         restro_name,
//                                         restro_address,
//                                         products: [{ productId, quantity, name, price, offer_price, type }]
//                                     });
//                                     return res.status(200).json({
//                                         status: 200,
//                                         message: "Your cart created successfully. 6"
//                                     });
//                                 })
//                             })
//                         }
//                     })
//                 })
//             }
//         })
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Something went wrong");
//     }

// }
