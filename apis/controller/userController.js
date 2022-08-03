require('dotenv').config()
const User_signUp = require('../model/userModel')
const restaurant_model = require('../model/signup')
const subCategory = require('../../admin/model/subCategory')
const cartModel = require('../../apis/model/cart')
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
const jwt = require('jsonwebtoken')
const { find } = require('../model/signup');
const nodemailer = require('nodemailer');
const auth = require("../../services/auth")

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
        user_type: 'user'
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







exports.logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out  🍀" });
};


//  add cart
 exports.cart =  async (req, res) => {
    const { productId, quantity, name, price, offer_price, type } = req.body;
    var userId = req.user.id;
    var vendorId = req.body.vendorId;
    try {
        let cart = await cartModel.findOne({ userId });
        cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {
            console.log(data)
            if (data == null) {
             restaurant_model.findOne({ _id: ObjectId(vendorId) }, (err, restrodata) => {
                    if (restrodata == null) {
                        return res.status(200).json({
                            status: 201,
                            message: "Restaurent not found."
                        });
                    }
                    var restro_address = restrodata.restro_address;
                    var restro_name = restrodata.restro_name;
                    if (cart) {
                        //cart exists for user
                        let itemIndex = cart.products.findIndex(p => p.productId == productId);
                        console.log(itemIndex)
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
                            productItem.quantity = quantity;
                            productItem.price = price;
                            productItem.offer_price = offer_price;
                            productItem.type = type;
                            cart.products[itemIndex] = productItem;
                        } else {
                            //product does not exists in cart, add new item
                            cart.products.push({ productId, quantity, name, price, offer_price, type });
                        }
                        cart = cart.save();
                        return res.status(200).json({
                            status: 200,
                            message: "Your cart updated successfully."
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
                            message: "Your cart created successfully."
                        });
                    }
                })
            } else {
                cartModel.findOne({ userId: ObjectId(userId) }, (err, data) => {
                    var cart_restro = data.restro_name;
                    restaurant_model.findOne({ _id: ObjectId(vendorId) }, (err, restrodata) => {
                        var restro_address = restrodata.restro_address;
                        var restro_name = restrodata.restro_name;
                        if (cart_restro == restrodata.restro_name) {
                            if (cart) {
                                //cart exists for user
                                let itemIndex = cart.products.findIndex(p => p.productId == productId);
                                console.log(itemIndex)
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
                                    productItem.quantity = quantity;
                                    productItem.price = price;
                                    productItem.offer_price = offer_price;
                                    productItem.type = type;
                                    cart.products[itemIndex] = productItem;
                                } else {
                                    //product does not exists in cart, add new item
                                    cart.products.push({ productId, quantity, name, price, offer_price, type });
                                }
                                cart = cart.save();
                                return res.status(200).json({
                                    status: 200,
                                    message: "Your cart updated successfully."
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
                                    message: "Your cart created successfully."
                                });
                            }
                        } else {
                            cartModel.findOne({ vendorId: ObjectId(vendorId) }, (err, cartdata) => {
                                cartModel.deleteOne({ userId: ObjectId(userId) }, (err, cartdata) => {
                                    const newCart = cartModel.create({
                                        userId,
                                        vendorId,
                                        restro_name,
                                        restro_address,
                                        products: [{ productId, quantity, name, price, offer_price, type }]
                                    });
                                    return res.status(200).json({
                                        status: 200,
                                        message: "Your cart created successfully."
                                    });
                                })
                            })
                        }
                    })
                })
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }



} 

exports.nearbyRestro =  async(req, res) => {
    var reqdata = req.body;
    var lat = reqdata.lat;
    var long = reqdata.long;
    var userId = [];
    locationModel.aggregate([
        {
            $geoNear: {
                near: {
                    "type": "Point",
                    "coordinates": [Number(long), Number(lat)]
                },
                "maxDistance": 32186.9,
                "spherical": true,
                query: { user_type: "vendor" },
                "distanceField": "restroDistance",
            }
        },
        { $limit: 5 }
    ], function (err, nearbyRestro) {
        if (nearbyRestro.length == 0) {
            return res.status(200).json({
                success: false,
                status: 401,
                message: "No nearby restaurant",
            });
        } else {
            return res.status(200).json({
                success: true,
                status: 200,
                message: "Nearby restaurant loaded",
                data: nearbyRestro
            });
        }
    });
}


