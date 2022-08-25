require('dotenv').config()
const bcrypt = require('bcrypt');
// const registeruserModel = require('../../apis/model/signup')
const signUp = require('../../apis/model/signup')
// const restaurant_additionalinfonModel = require('../model/additionalinfo')

const jwt = require('jsonwebtoken');
// const locationModel = require('../model/location').location;
const { apiAuthAuthenticated, authorization, generateAccessToken } = require('../../services/auth');
const auth = require("../../services/auth")
const orderModel = require('../../apis/model/order').order;
const aws = require("aws-sdk")

// Creating Vendor
exports.addrestaurant = async function (req, res, next) {
    try {
        // let payload;
        // const confirm_email = req.body.confirm_email
        const email = req.body.email
        // if (email !== confirm_email) {
        //     res.status(400).json({
        //         status: false,
        //         message: " email/confirm email does not  match",
        //     })
        // } else {
        let lattitude = req.body.lattitude
        let longitude = req.body.longitude
        let payload = {
            cordinates: [
                longitude, lattitude
            ]
        }

        // let payload = ({ longitude, lattitude })


        // console.log(req.files.filename)
        const singupRecords = new signUp({

            restaurant_name: req.body.restaurant_name,
            restaurant_address: req.body.restaurant_address,
            pincode: req.body.pincode,
            contact_number: req.body.contact_number,
            email: req.body.email,
            meal_timming: req.body.meal_timming,


            // city:req.body.city,
            //  password: hashedPassword,

            primary_cuisine: req.body.primary_cuisine,
            secoundry_cuisine: req.body.secoundry_cuisine,
            // photo_id: req.files.photo_id[0].filename,
            // proof_of_ownership: req.files.proof_of_ownership[0].filename,
            // shop_image_front: req.files.shop_image_front[0].filename,
            // foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
            // permission_to_trade: req.files.permission_to_trade[0].filename,



            // menu: req.files.menu[0].filename,
            // restaurant_logo: req.files.restaurant_logo[0].filename,
            // bank_details: req.body.bank_details,
            // address_of_welcome_pack: req.body.address_of_welcome_pack,
            // account_holder_type: req.body.account_holder_type,
            // account_holder_name: req.body.account_holder_name,
            // routing_number: req.body.routing_number,
            // account_number: req.body.account_number,
            // bank_name: req.body.bank_name,
            // bank_id: req.body.bank_id, 
            business_operate: req.body.business_operate,
            typeof_location: req.body.typeof_location,
            drivers_availability: req.body.drivers_availability,
            status: true,
            is_registered: true,
            user_type: 'vendor',
            loc: payload,

        })

        const check = await signUp.findOne({ email: req.body.email })
        if (check !== null) {
            res.status(400).json({
                status: false,
                message: ' restaurant already exist with this email !'
            })
        } else {


            await singupRecords.save();
            //             singupRecords.save(function (err, new_data) {
            //                 if (err) return next(err);
            // console.log(new_data)
            //                 var userid = new_data._id;
            //                 const payload = {
            //                     email: email,
            //                     id: userid,
            //                     first_name: first_name,
            //                     last_name: last_name,
            //                 };
            //                 let envsecret = commonservices.getSecretToken();
            //                 let token = jwt.sign(payload, envsecret);
            res.status(200).json({
                status: true,
                message: "Successfully Signed up",
                'results': singupRecords,

            })
        }

    }
    catch (err) {
        res.status(400).json({
            status: false,
            'result': (err.message),
            'message': "Please submit details "

        })
    }
}

//Update Resturent Details
exports.updateResturantDetails = async (req, res) => {

    try {
        const updateResDetails = await signUp.findByIdAndUpdate(req.params.id, {
            restaurant_name: req.body.restaurant_name,
            owner_name: req.body.owner_name,
            restaurant_address: req.body.restaurant_address,
            contact_number: req.body.contact_number,
            email: req.body.email,
            // city:req.body.city,
            //  password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            primary_cuisine: req.body.primary_cuisine,
            secoundry_cuisine: req.body.secoundry_cuisine,
            pincode: req.body.pincode,

            meal_timming: req.body.meal_timming,
            // routing_number: req.body.routing_number,
            // account_number: req.body.account_number,
            // bank_name: req.body.bank_name,
            // bank_id: req.body.bank_id, 
            business_operate: req.body.business_operate,
            typeof_location: req.body.typeof_location,
            drivers_availability: req.body.drivers_availability,
            status: true,
            is_registered: true,
            user_type: 'vendor'
        })
        res.status(200).json({
            status: true,
            message: "Successfully Updated Resturent details",
            'results': updateResDetails
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

//Deleting Vendor
exports.delete_vendor = async (req, res) => {
    try {
        const result = await signUp.findByIdAndDelete(req.params.id)
        if (result) {

            res.status(200).json({
                status: true,
                message: "Successfully Deleted ",

            })
        } else {

            res.status(200).json({
                status: true,
                message: "Already  Deleted ",

            })
        }

    } catch (error) {
        res.status(400).json(error.message)
    }
}

//Get all restaurant
exports.get_restaurants = async (req, res) => {
    try {
        const result = await signUp.find()
        res.status(200).json({
            status: true,
            message: "Successfully Fetched all restaurants",
            'total': result.length,
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// Get restro by id
exports.get_restrobyid = async (req, res) => {
    var id = req.params.id
    try {
        const result = await signUp.findOne({_id:id})
        res.status(200).json({
            status: true,
            message: "Successfully Fetched  Restaurant",
          
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// SIgn UP
exports.addrestaurant = async function (req, res, next) {
    try {
        // let payload;
        // const confirm_email = req.body.confirm_email
        const email = req.body.email
        // if (email !== confirm_email) {
        //     res.status(400).json({
        //         status: false,
        //         message: " email/confirm email does not  match",
        //     })
        // } else {
        let lattitude = req.body.lattitude
        let longitude = req.body.longitude
        let payload = {
            cordinates: [
                longitude, lattitude
            ]
        }

        // let payload = ({ longitude, lattitude })


        // console.log(req.files.filename)
        const singupRecords = new signUp({

            restaurant_name: req.body.restaurant_name,
            restaurant_address: req.body.restaurant_address,
            pincode: req.body.pincode,
            contact_number: req.body.contact_number,
            email: req.body.email,
            meal_timming: req.body.meal_timming,


            // city:req.body.city,
            //  password: hashedPassword,

            primary_cuisine: req.body.primary_cuisine,
            secoundry_cuisine: req.body.secoundry_cuisine,
            // photo_id: req.files.photo_id[0].filename,
            // proof_of_ownership: req.files.proof_of_ownership[0].filename,
            // shop_image_front: req.files.shop_image_front[0].filename,
            // foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
            // permission_to_trade: req.files.permission_to_trade[0].filename,



            // menu: req.files.menu[0].filename,
            // restaurant_logo: req.files.restaurant_logo[0].filename,
            // bank_details: req.body.bank_details,
            // address_of_welcome_pack: req.body.address_of_welcome_pack,
            // account_holder_type: req.body.account_holder_type,
            // account_holder_name: req.body.account_holder_name,
            // routing_number: req.body.routing_number,
            // account_number: req.body.account_number,
            // bank_name: req.body.bank_name,
            // bank_id: req.body.bank_id, 
            business_operate: req.body.business_operate,
            typeof_location: req.body.typeof_location,
            drivers_availability: req.body.drivers_availability,
            status: true,
            is_registered: true,
            user_type: 'vendor',
            loc: payload,

        })

        const check = await signUp.findOne({ email: req.body.email })
        if (check !== null) {
            res.status(400).json({
                status: false,
                message: ' restaurant already exist with this email !'
            })
        } else {
            await singupRecords.save();
            //             singupRecords.save(function (err, new_data) {
            //                 if (err) return next(err);
            // console.log(new_data)
            //                 var userid = new_data._id;
            //                 const payload = {
            //                     email: email,
            //                     id: userid,
            //                     first_name: first_name,
            //                     last_name: last_name,
            //                 };
            //                 let envsecret = commonservices.getSecretToken();
            //                 let token = jwt.sign(payload, envsecret);
            res.status(200).json({
                status: true,
                message: "Successfully Signed up",
                'results': singupRecords,

            })
        }

    }
    catch (err) {
        res.status(400).json({
            status: false,
            'result': (err.message),
            'message': "Please submit details "

        })
    }
}


exports.restaurant_additionalinfo = async function (req, res, next) {
    // try{
    // console.log(req.file.filename)
    var restro_id = req.user.id
    signUp.findOne({ _id: restro_id }, (err, userdata) => {
        console.log(userdata)

        var restro_name = userdata.restaurant_name
        var monday_open = req.body.monday_open
        var monday_close = req.body.monday_close
        var tuesday_open = req.body.tuesday_open
        var tuesday_close = req.body.tuesday_close
        var wednesday_open = req.body.wednesday_open
        var wednesday_close = req.body.wednesday_close
        var thursday_open = req.body.thursday_open
        var thursday_close = req.body.thursday_close
        var friday_open = req.body.friday_open
        var friday_close = req.body.friday_close
        var saturday_open = req.body.saturday_open
        var saturday_close = req.body.saturday_close
        var sunday_open = req.body.sunday_open
        var sunday_close = req.body.sunday_close

        let info = new restaurant_additionalinfonModel();


        info.restaurant_name = restro_name,
            info.timmings.monday_open = monday_open,
            info.timmings.monday_close = monday_close,
            info.timmings.tuesday_open = tuesday_open,
            info.timmings.tuesday_close = tuesday_close,
            info.timmings.wednesday_open = wednesday_open,
            info.timmings.wednesday_close = wednesday_close,
            info.timmings.thursday_open = thursday_open,
            info.timmings.thursday_close = thursday_close,
            info.timmings.friday_open = friday_open,
            info.timmings.friday_close = friday_close,
            info.timmings.saturday_open = saturday_open,
            info.timmings.saturday_close = saturday_close,
            info.timmings.sunday_open = sunday_open,
            info.timmings.sunday_close = sunday_close,



            payload = {

                restaurant_name: restro_name,
                timmings: [{ monday_open, monday_close, tuesday_open, tuesday_open, thursday_open, thursday_close, friday_open, friday_close, saturday_open, saturday_close, sunday_open, sunday_close }],
            };

        console.log(payload)
        NewTicket = new restaurant_additionalinfonModel(payload);
        NewTicket.save(
            (function (err, obj) {
                if (err) throw err;
                return res.status(200).json({
                    success: true,
                    message: " Data  added  successfully",
                    payload: NewTicket
                });
            }));
        // console.log(itemdata)s



    })
}

// try{
//     console.log(req.file.filename)
// var restro_id = req.params.id
// signUp.findOne({ _id: restro_id }, (err, userdata) => {
//     var reqdata = req.body
//     console.log(userdata)
//     var restro_id = userdata.restaurant_id;

//     var item_name = req.body.item_name;
//     var reqdata = req.body;
//     var category = userdata.category_name;
//     var Product_name = reqdata.Product_name;
//     var Product_description = reqdata.Product_description;
//     var price = reqdata.price;
//     var quantity = reqdata.quantity;
//     var image = req.file.filename;
//     var offer_price = reqdata.offer_price



//     registerusersModel.findOne({ _id: restro_id, }, (err, restrodate) => {


//         var restro_name = restrodate.restaurant_name
//         var type = restrodate.user_type
//         // var errors = req.validationErrors();
//         let menu = new itemModel();
//         menu.parent = category,
//             menu.products.item_name = item_name,
//             menu.products.Product_name = Product_name,
//             menu.products.Product_description = Product_description,
//             menu.products.price = price,
//             menu.products.quantity = quantity,
//             menu.products.image = image,
//             menu.vendorId = req.params.id,
//             menu.products.type = type,
//             menu.products.offer_price = offer_price,
//             menu.products.restro_name = restro_name



//         itemModel.findOne({ item_name: item_name }, (err, itemdata) => {

//             if (itemdata == null) {
//                 if(image){

//                     const payload = {
//                         parent: category,
//                         item_name: item_name,
//                         products: [{ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price }],
//                     };
//                 }else{
//                     const payload = {
//                         parent: category,
//                         item_name: item_name,
//                         products: [{ Product_name, Product_description, price, quantity,  type, restro_name, offer_price }],
//                     };
//                 }
//                 // console.log(products,"!1111")
//                 var NewTicket = new itemModel(payload);
//                 NewTicket.save(
//                     (function (err, obj) {
//                         if (err) throw err;
//                         return res.status(200).json({
//                             success: true,
//                             message: "Item created successfully",
//                             payload: payload
//                         });
//                     }));
//                 console.log(itemdata)
//             } else {
//                 if (itemdata.item_name == item_name) {
//                    if(image){

//                        itemdata.products.push({ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price });
//                        itemdata.save();
//                     }else{
//                         itemdata.products.push({ Product_name, Product_description, price, quantity,  type, restro_name, offer_price });
//                         itemdata.save();
//                     }
//                     console.log(itemdata, ">>>>.");
//                     return res.status(200).json({
//                         status: 200,
//                         message: "item updated successfully successfully.",
//                         result: itemdata
//                     });
//                 }
//             }
//         })

//     })
// })
// } catch (err) {
// res.status(400).json({
//     status: false,
//     'result': (err.message),
//     'message': "  menu creation unsuccessfull "

// })
// }
// }







// }}}




exports.menu_bank_details = async function (req, res, next) {

    try {

        var updateResDetails = await signUp.findByIdAndUpdate(req.params.id, {



            account_holder_name: req.body.account_holder_name,

            account_number: req.body.account_number,
            bank_name: req.body.bank_name,
            ifsc_code: req.body.ifsc_code,

        })






        // await singupRecords.save();
        res.status(200).json({
            status: true,
            message: "Successfully Updated  record",
            'results': updateResDetails,

        })
    }
    catch (err) {
        res.status(400).json({
            status: false,
            'result': (err.message),
            'message': "Please submit all the  files"
        })
    }

}



exports.ownership_verification = async function (req, res, next) {

    try {

        const updateResDetails = await signUp.findByIdAndUpdate(req.params.id, {

            owner_email: req.body.owner_email,
            owner_name: req.body.owner_name,
            gender: req.body.owner_name,
            owner_address: req.body.owner_address,
            owner_pincode: req.body.owner_pincode,

            photo_id_name: req.body.photo_id_name,
            photo_id: req.files.photo_id[0].location,
            ownership_certificate_name: req.body.certificate_name,
            proof_of_ownership: req.files.proof_of_ownership[0].location,
            shop_image_front: req.files.shop_image_front[0].location,
            foot_hygiene_registration: req.files.foot_hygiene_registration[0].location,
            permission_to_trade: req.files.permission_to_trade[0].location,

            menu: req.files.menu[0].location,
            restaurant_logo: req.files.restaurant_logo[0].location,

            address_of_welcome_pack: req.body.address_of_welcome_pack,
        })

        // await singupRecords.save();
        res.status(200).json({
            status: true,
            message: "Successfully Updated ownership record",
            'results': updateResDetails,

        })
    }
    catch (err) {
        res.status(400).json({
            status: false,
            'result': (err.message),
            'message': "Please submit all the  required documents"
        })
    }

}

// exports.addResturent = async function (req, res, next) {
// 	// var requestbody = req.body;

// 	// .checkBody('token', "Token is Required").notEmpty();

//     const  restaurant_address= req.body.restaurant_address;
//     var  contact_number= req.body.contact_number;
//                var  email= req.body.email;
//                 //  password: hashedPassword,
//                var  first_name= req.body.first_name;
//                var  last_name= req.body.last_name;
//                var  primary_cuisine=req.body.primary_cuisine;
//                var  secoundry_cuisine= req.body.secoundry_cuisine;
//                 // photo_id: req.files.photo_id[0].filename,
//                 // proof_of_ownership: req.files.proof_of_ownership[0].filename,
//                 // shop_image_front: req.files.shop_image_front[0].filename,
//                 // foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
//                 // menu: req.files.menu[0].filename,
//                 // restaurant_logo: req.files.restaurant_logo[0].filename,
//                 // bank_details: req.body.bank_details,
//                 // address_of_welcome_pack: req.body.address_of_welcome_pack,
//                 // account_holder_type: req.body.account_holder_type,
//                 // account_holder_name: req.body.account_holder_name,
//                 // routing_number: req.body.routing_number,
//                 // account_number: req.body.account_number,
//                 // bank_name: req.body.bank_name,
//                 // bank_id: req.body.bank_id, 
//                var  bussiness_operate= req.body.bussiness_operate;
//                 var typeof_location= req.body.typeof_location;
//                 var drivers_availability= req.body.drivers_availability;
//                var  status= true;
//                var  is_registered= true;
//                var  user_type='vendor'

// 	// var errors = req.validationErrors();

// 		signUp.find({ email: email }, (err, rows1) => {
// 			if (rows1.length > 0) {
// 				res.status(400).json({
// 					email: email,
// 					status: 401,
// 					message: 'The email you entered is already registered.',
// 				});

// 			} else {
// 				signUp.findOne({ email: email }, (err, rows) => {

//                     console.log(rows,"fffffff")
//                     if (!rows) {


// 						var serachap = {
//                             restaurant_address:  restaurant_address,
// 							contact_number: contact_number,
// 							first_name: first_name,
// 							email: email,
// 							last_name: last_name,
// 							primary_cuisine: primary_cuisine,
//                             secoundry_cuisine:secoundry_cuisine,
//                             bussiness_operate:bussiness_operate,
//                             typeof_location:typeof_location,
//                             drivers_availability:drivers_availability

// 						};

// 						var New_User = new signUp(serachap);
//                         console.log(New_User)
// 						New_User.save(function (err, new_data) {
// 							if (err) return res.send(err);

//                             return res.status(200).json({
//                                 status: 200,
//                                 // data: delres,
//                                 message: "vendor created successfully",
//                                 meta: new_data
// 							});
// 							// let envsecret = commonservices.getSecretToken();
// 							// let token = jwt.sign(payload, envsecret);
// 							// bcrypt.genSalt(10, function (err, salt) {
// 							// 	bcrypt.hash(password, salt, function (err, hash) {
// 							// 		if (err) return res.send(err);
// 							// 		registerusersModel.update({
// 							// 			_id: userid
// 							// 		}, {
// 							// 			$set: {
// 							// 				password: hash,
// 							// 				token: token
// 							// 			}
// 							// 		}, function (err, result) {
// 							// 			if (err) return res.send(err);
// 							// 			registerusersModel.findOne({ _id: userid }, (err, delres) => {
// 							// 				return res.status(200).json({
// 							// 					status: 200,
// 							// 					data: delres,
// 							// 					message: "vendor created successfully",
// 							// 					meta: req.phoneMeta
// 							// 				});
// 							// 			})

// 							// 		});
// 							// 	});
// 							// });

// 						});
// 					}


//                     else{
//                         res.status(400).json({
//                             email: email,
//                             status: 401,
//                             message: 'failure',
//                         });
//                     }
// 				});
// 			}
// 		});


// },










//Update Resturent Details
exports.updateResturantDetails = async (req, res) => {

    try {
        const updateResDetails = await signUp.findByIdAndUpdate(req.params.id, {
            restaurant_name: req.body.restaurant_name,
            owner_name: req.body.owner_name,
            restaurant_address: req.body.restaurant_address,
            contact_number: req.body.contact_number,
            email: req.body.email,
            // city:req.body.city,
            //  password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            primary_cuisine: req.body.primary_cuisine,
            secoundry_cuisine: req.body.secoundry_cuisine,
            pincode: req.body.pincode,

            meal_timming: req.body.meal_timming,
            // routing_number: req.body.routing_number,
            // account_number: req.body.account_number,
            // bank_name: req.body.bank_name,
            // bank_id: req.body.bank_id, 
            business_operate: req.body.business_operate,
            typeof_location: req.body.typeof_location,
            drivers_availability: req.body.drivers_availability,
            status: true,
            is_registered: true,
            user_type: 'vendor'
        },{new:true})
        res.status(200).json({
            status: true,
            message: "Successfully Updated Resturent details",
            'results': updateResDetails
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// Delete Restaurent 
exports.deleteRetaurant = async (req, res) => {
    try {
        const result = await signUp.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: true,
            message: "Successfully Deleted ",
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}


exports.Accept_status_restro = async (req, res) =>{
          
    try {
        const ResDetails = await signUp.findByIdAndUpdate(req.params.id,    {
          
            status: true,
           
        },{new:true})
        res.status(200).json({
            status: true,
            message: "Successfully Updated Resturent status ",
            'results': ResDetails
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
    

}
exports.Reject_status_restro = async (req, res) =>{
          
    try {
        signUp.findByIdAndUpdate(
        req.params.id,
        {status: false},
        {new:true},
        (err,data)=>{
            if(err){
                res.status(400).json(error.message)
            }else{
                res.status(200).json({
                    status: true,
                    message: "Successfully Updated Resturent status ",
                    'results': data
                })
            }
        })
     

    } catch (error) {
        res.status(400).json(error.message)
    }
    

}










