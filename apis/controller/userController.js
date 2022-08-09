require('dotenv').config()
const User_signUp = require('../model/userModel')
const restaurant_model = require('../model/signup')
const subCategory = require('../../admin/model/subCategory')
const cartModel = require('../model/cart').cart
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
const locationModel = require("../model/location")
const jwt = require('jsonwebtoken')
const { find } = require('../model/signup');
const nodemailer = require('nodemailer');
const auth = require("../../services/auth")
var lodash = require('lodash');
var randomstring = require("randomstring");

let itemModel = require('../../apis/model/item').item;
let orderModel = require('../../apis/model/order').order;

//USER SING UP
exports.addUser = async function (req, res, next) {
    
 
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const singupRecords = new User_signUp({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
      
        address: req.body.address,
        password: hashedPassword,
        status: true,
        is_registered: true,
        type: 'user'
    })

    try {
        const check = await User_signUp.findOne( { email: req.body.email })
        if (check !== null) {
            res.status(400).json('Email Already Registered !')
        } else {
            await singupRecords.save();
            res.status(200).json({
                status: true,
                message: "Successfully Signed up",
                'results': singupRecords
            })
        }

    } catch (err) {
        res.status(400).json(err.message)
    }
};

//Update User Details
exports.updateUser = async (req, res) => {
    try {
        const updateUserDetails = await User_signUp.findByIdAndUpdate(req.params.id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            address: req.body.address,
          
      
        })
        res.status(200).json({
            status: true,
            message: "Successfully userdetails details",
            'results': updateUserDetails
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// Delete User 
exports.deleteUser = async (req, res) => {
    try {
        const result = await User_signUp.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: true,
            message: "Successfully Deleted ",
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// update the password
exports.changePassword = async (req, res) => {
    try {
        const databasePassword = await signUp.findById(req.params.id)
        const validPassword = await bcrypt.compare(req.body.currPassword, databasePassword.password)

        if (validPassword) {
            const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
            const results = await signUp.findByIdAndUpdate(req.params.id, { password: hashedPassword })
            res.status(200).json({
                status: true,
                message: "Successfully Updated Password",
                'results': results
            })

        } else {
            res.status(400).json({
                status: false,
                message: "Entered Current Password is wrong",
            })
        }

    } catch (error) {
        res.status(400).json(error.message)
    }

}
// Login
exports.logIn = async (req, res) => {


    try {
        const check = await User_signUp.findOne({ email: req.body.email })
        if (check === null) {
            res.status(400).json({
                status: false,
                message: 'Email is wrong'
            })

        } else {
            const validPassword = await bcrypt.compare(req.body.password, check.password)
            if (validPassword) {

                const payload = {
                    email: req.body.email,
                    id: check.id,
                    password: req.body.password
                };
                // console.log(check.id)
                // const payload = {
                //     email: req.body.email,
                //     password: req.body.password,
                //     id:check.id


                // };
                let envsecret = auth.getSecretToken();
                let token = jwt.sign(payload, envsecret);
                res.cookie("access_token", token, {
                    httpOnly: true
                })


                res.status(200).json({
                    status: true,
                    message: 'Successfully Signed in',
                    'user_type': check.user_type,
                    'token': token
                })

            } else {
                res.status(400).json({
                    status: false,
                    message: 'password is wrong'
                })
            }
        }

    } catch (err) {
        res.status(400).json(err.message)
    }

}

exports.guest_login = async(req,res)=>{
    var guest_id = randomstring.generate({
        length: 6,
        charset: 'numeric'
      });
      var guest = "guest"
      var guestId = "guest-" + guest_id;
      var guestdata = {
        guest_id:guestId,
        type:guest
    };
    var New_guest = new User_signUp(guestdata);
    New_guest.save(function (err, new_data) {
        if (err) return next(err);
else{
        var userid = new_data._id;
        const payload = {
            id: userid,
            guest_id:guestId,
            type:guest
        };
        let envsecret = auth.getSecretToken();
        let token = jwt.sign(payload, envsecret);
        res.cookie("access_token", token, {
            httpOnly: true
        })}res.status(200).json({
            status :true,
            data:new_data,
            message:" Guest loggedin" ,


        })

      

             
    });
}

exports.Searchby_pincode = async(req,res)=>{
try{

    let data = await restaurant_model.find({
        
        "$or":[
            {pincode:{$regex:req.params.key}}
        ]
         })
       .select({restaurant_name:1,restaurant_address:1})
       if (data.length > 0){
           res.status(200).json({
               status:"true..",
               result:data
            })
              
         }
         else{
            res.status(400).json({

                status: false,
                message: 'No resrautrants related to this pincode'
            })
         }
}
catch(error){
    res.status(400).json({

        status: false,
        message: 'No resrautrants related to this pincode'
    })

}}

exports.Searchby_pincode = async(req,res)=>{
    try{
    
        let data = await restaurant_model.find({
            
            "$or":[
                {pincode:{$regex:req.params.key}}
            ]
             })
           .select({restaurant_name:1,restaurant_address:1})
           if (data.length > 0){
               res.status(200).json({
                   status:"true..",
                   result:data
                })
                  
             }
             else{
                res.status(400).json({
    
                    status: false,
                    message: 'No resrautrants related to this pincode'
                })
             }
    }
    catch(error){
        res.status(400).json({
    
            status: false,
            message: 'No resrautrants related to this pincode'
        })
    
    }}


exports.Searchby_mealtimming = async(req,res)=>{
    try{
    
        let data = await restaurant_model.find({
            
            "$or":[
                {meal_timming:{$regex:req.params.key}}
            ]
             })
           .select({restaurant_name:1,restaurant_address:1})
           if (data.length > 0){
               res.status(200).json({
                   status:"true..",
                   result:data
                })
                  
             }
             else{
                res.status(400).json({
    
                    status: false,
                    message: 'No resrautrants available for this time shift '
                })
             }
    }
    catch(error){
        res.status(400).json({
    
            status: false,
            message: 'No resrautrants available for this time shift '
        })
    
    }}

exports.getrestro_byid = async(req,res)=>{
        let payload = req.params;
        payload.userId = req.params.id;

        restaurant_model.findById({_id : payload.userId} , (err ,userdetails ) => {
           
           if(userdetails){
           
            res.status(200).json({
                status:"true..",
                result:userdetails
             })
            }else{

                res.status(400).json({
                    status:"false",
                    result:"No records"
                 })
            }

        }, {
              
                // imageData:userimage,

              
                
            });
        
    }
// 

exports.logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out  🍀" });
};


//  add cart
 exports.cart =  async (req, res) => {
    const { productId, name, price, offer_price, type } = req.body;
    let quantity = req.body.quantity
    var userId = req.user.id;
    var vendorId = req.body.vendorId;
    try {
        // let cart = await cartModel.find();
        let cart = await cartModel.findOne({ userId });
        cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {
          
                restaurant_model.findOne({ _id: ObjectId(vendorId) }, (err, restrodata) => {
                    if (restrodata == null) {
                        return res.status(200).json({
                            status: 201,
                            message: " No restaurant found "
                        });
                    }
                    var restro_address = restrodata.restro_address;
                    var restro_name = restrodata.restro_name;
                    if (data) {
                        //cart exists for user
                        let itemIndex = cart.products.findIndex(p => p.productId == productId);
                        
                        
                        // console.log(itemIndex)
                        // console.log(quantity)
                        // console.log(itemIndex)
                        // if (itemIndex !== -1 && quantity <= 0) {
                        //     cart.products.splice(itemIndex, 0);
                        //     if (cart.products.length == 0) {
                        //         cart.quantity = 0;
                        //     } else {
                        //         cart.price = cart.products.map(products => products.price).reduce((acc, next) => acc + next);
                        //     }
                        // }
                        if (itemIndex > -1) {
                            //product exists in the cart, update the quantity
                            let productItem = cart.products[itemIndex];
                            // console.log(productItem)
                             let newQuantity = cart.products[itemIndex].quantity
                             newQuantity++
                             
                            productItem.quantity = newQuantity;
                            productItem.price = price;
                            productItem.offer_price = offer_price;
                            productItem.type = type;
                            cart.products[itemIndex] = productItem;
                            //  cart.products.push({ productId, quantity, name, price, offer_price, type });
                        } else {
                            //product does not exists in cart, add new item
                            cart.products.push({ productId, quantity, name, price, offer_price, type });
                        }
                        cart = cart.save();
                        return res.status(200).json({
                            status: 200,
                            message: "Your cart prducts quatity updated successfully."
                        });
                    } else {
                        //no cart for user, create new cart
                        const newCart = cartModel.create({
                            userId,
                            vendorId,
                            restro_name,
                            restro_address,
                            products: [{ productId, quantity, name, price, offer_price, type }]
                        });
                        return res.status(200).json({
                            status: 200,
                            message: "Your cart created successfully. "
                        });
                    }
                })
            } )
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }



} 



exports.cart_list =  async (req, res) => {
    var id = req.user.id;
    cartModel.find({ userId: ObjectId(id) }, (err, cartdata) => {
        
        let result = cartdata.map(a => a.vendorId == 99);
        //  console.log(result)

        let productId = cartdata.map(p => p.products);
        let quantity = cartdata.map(a => a.quantity);
        let pro = cartdata.map(p => p.products);
    //     let newArray = lodash.flatten(pro);
    //  console.log("pro", pro)
    //      console.log("qwe", quantity)

        var vendorId = result.toString()
        // console.log(vendorId)
        itemModel.findOne({ vendorId: vendorId }, (err, itemdata) => {
            if (cartdata.length == 0) {
                return res.status(200).json({
                    status: 401,
                    message: 'No item available in your cart'
                });
            } else {
                return res.status(200).json({
                    status: 200,
                    data: cartdata,
                    message: 'cart listing loaded'
                });
            }
        })
    })
},

exports.clear_cart = async (req, res) => {
    try{

      const  id  = req.params.id;
      const { productId_no } = req.body;
   
  
  //   console.log(data)
      cartModel.findOne({ _id: id }, (err, cartdata) => {
          console.log(cartdata,"dddddddd")
          var products = cartdata.products
          
          if (products.length == 1) { 
              cartModel.findOneAndDelete({ _id: ObjectId(id) }, (err, cartdata) => {
                  return res.status(200).json({
                      status: 200,
                      message: "Your cart is empty"
                  });
              })
          } else {
              console.log(cartdata.products.splice(productId_no, 1))
              cartdata = cartdata.save();
              return res.status(200).json({
                  status: 200,
                  message: "Your quantity reduced successfull."
              });
          }
  
      }) }catch(err){
  
       res.status(400).json({
          status: 400,
          message: "something went wrong"
      })}
  },
  

exports.nearbyRestro =  async(req, res) => {
    var reqdata = req.body;
    var lat = reqdata.lat;
    var long = reqdata.long;
    console.log(Number(lat))
    var userId = [];
    restaurant_model.aggregate([
        {
            $geoNear: {
                near: {
                    "type": "Point",
                    "coordinates": [parseFloat(75.828819), parseFloat(26.901336)]
                },
                "maxDistance": parseFloat(32186.9)*1609,
                "spherical": true,
                query: { user_type: "vendor" },
                "distanceField": "restroDistance",
            }
        },
        { $limit: 5 }
    ], function (err, nearbyRestro) {
        if (nearbyRestro) {
            return res.status(200).json({
                success: true,
                status: 200,
                message: "Nearby restaurant loaded",
                data: nearbyRestro
            });
           
        } else {
           
            return res.status(200).json({
                success: false,
                status: 401,
                message: "No nearby restaurant",
                err :err.message
            });
        }
    });
}




 exports. create_order = (req, res) => {
    var reqdata = req.body;
    var order_id = randomstring.generate({
        length: 6,
        charset: 'numeric'
      });
  
    var transaction_id =randomstring.generate({
        length: 9,
        charset: 'numeric'
      });;
    var transaction_status = 'complete';
    // console.log(req.user)
    var id1 = req.user.id
    var id = req.body.id
    console.log(id)
    User_signUp.findOne({ _id: id1 }, (err, userdata) => {
   
        var first_name = userdata.first_name;
        var last_name = userdata.last_name;
        var customerID = userdata._id;
        cartModel.findOne({ _id: id }, (err, cartdata) => {
          
            console.log(cartdata)
                if (err) throw err;
        if(cartdata){
            console.log(cartdata)
            var restro_name = cartdata.restro_name;
            var restro_address = cartdata.restro_address;
            var vendorID = cartdata.vendorId;
            var payment = reqdata.payment;
            var subtotal = reqdata.subtotal;
            var products = cartdata.products;
            // var errors = req.validationErrors();
            restaurant_model.findOne({ _id: vendorID }, (err, vendordata) => {
                var mobile = vendordata.mobile;
                var restro_image = vendordata.image;
                console.log(vendordata)
                console.log(mobile)
                let order = new orderModel();
                order.transaction_id = transaction_id,
                    order.transaction_status = transaction_status,
                    order.order_id = order_id,
                    order.first_name = first_name,
                    order.last_name = last_name,
                    order.restro_name = restro_name,
                    order.restro_address = restro_address,
                    order.mobile = mobile,
                    order.restro_image = restro_image,
                    order.payment = payment,
                    order.products = products
                order.vendorID = vendorID,
                    order.customerID = customerID,
                    order.subtotal = subtotal,
                    order.products = products
                const payload = {
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
                    products: products
                };
                var NewTicket = new orderModel(payload);
                NewTicket.save(function (err, obj) {
                    cartModel.deleteOne({ _id: ObjectId(id) }, (err, cartdata) => {
                        if (err) throw err;
                        return res.status(200).json({
                            success: true,
                            message: "order created successfully",
                            payload: payload
                        });
                    });
                });
            })
    }else{
        return res.status(400).json({
            success: false,
            message: "No order in cart",
           
        });

    }
})
    })
}
 exports.order_listing  = (req, res) => {
    var id = req.user.id
    orderModel.find({ customerID: id }, (err, order_data) => {
        var userorderr = order_data.reverse()
        var userorder = order_data

        if (order_data.length == 0) {
            return res.status(200).json({
                success: true,
                status: 201,
                message: "You have no orders",
            });
        } else {
            return res.status(200).json({
                success: true,
                data: userorder,
                status: 200,
                message: "order listing successfully",
            });
        }
    })
}
















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















