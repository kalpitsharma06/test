require('dotenv').config()
const signUp = require('../model/signup')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const locationModel = require('../model/location').location;
const { apiAuthAuthenticated, authorization, generateAccessToken } = require('../../services/auth');
const auth = require("../../services/auth")

// SIgn UP
exports.addResturent = async function (req, res, next) {
    // const password = req.body.password
    // console.log(req)
    //     if(password ){
    
            
    //         console.log(password)
    //         const confirmPassword = req.body.confirmPassword
    //         let hashedPassword = ""
    //         if (password == confirmPassword) {
    //             hashedPassword = await bcrypt.hash(password, 10)
    //         } else {
    //         res.status(400).json({
    //             status: false,
    //             message: " passwords does not  match",
    //         })
    //     }
    // }
    // else{
        
        try {
            console.log(req.files.filename)
            const singupRecords = new signUp({
                restaurant_name: req.body.restaurant_name,
                restaurant_address: req.body.restaurant_address,
                contact_number: req.body.contact_number,
                email: req.body.email,
            // city:req.body.city,
            //  password: hashedPassword,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            primary_cuisine: req.body.primary_cuisine,
            secoundry_cuisine: req.body.secoundry_cuisine,

            // photo_id: req.files.photo_id[0].filename,
            // proof_of_ownership: req.files.proof_of_ownership[0].filename,
            // shop_image_front: req.files.shop_image_front[0].filename,
            // foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
            // permission_to_trade:req.files.permission_to_trade[0].filename,
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
            bussiness_operate: req.body.bussiness_operate,
            typeof_location: req.body.typeof_location,
            drivers_availability: req.body.drivers_availability,
            status: true,
            is_registered: true,
            user_type: 'vendor'
        })

            const check = await signUp.findOne({ email: req.body.email })
            if (check !== null) {
                res.status(400).json('This restaurant already exist !')
            } else 
                {
                
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
                    
                  })}
    
        } catch (err) {
            if(err.message == "Cannot read properties of undefined (reading '0')"){
                res.status(400).json({
                    status : false,
                    message : "Please  submit the ownership records"
                })
            }else{
                res.status(400).json(err.message)
            }
            
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
exports.updateResturentDetails = async (req, res) => {
    console.log(req.user.id)
    try {
        const updateResDetails = await signUp.findByIdAndUpdate(req.params.id, {
            restaurant_name: req.body.restaurant_name,
            restaurant_address: req.body.restaurant_address,
            contact_number: req.body.contact_number,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            primary_cuisine: req.body.primary_cuisine,
            secoundry_cuisine: req.body.secoundry_cuisine,
            // photo_id: req.files.photo_id[0].filename,
            // proof_of_ownership: req.files.proof_of_ownership[0].filename,
            // shop_image_front: req.files.shop_image_front[0].filename,
            // foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
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
            bussiness_operate: req.body.bussiness_operate,
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

exports.forgotpassword = (req, res, next) => {
    var email = req.body.email;
    signUp.findOne({ email: email }, (err, userdata) => {
        if (userdata == null) {
            return res.status(200).json({
                status: 201,
                message: "This email is not registered",
            });
        }

        else {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'madhav.appic@gmail.com',
                    pass: ''
                }
            });

            var mailOptions = {
                from: 'madhav.appic@gmail.com',
                to: 'madhavshridhar3@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error.message);
                } else {
                    return res.status(200).json({
                        status: 200,
                        message: "Verification has been sent to your registered email",
                        messageId: mailOptions
                    });
                }

            });
            // var userid = userdata._id
            // const sender = " madhav.appic@gmail.com";
            // const recipient = email
            // const subject = "Verify your email to reset your password";
            // const body_text = "Click on the link to reset password\n" + "http://13.58.214.98:8700/api/reset_password/" + userid;

            // var params = {
            //     Source: sender,
            //     Destination: {
            //         ToAddresses: [
            //             recipient
            //         ],
            //     },
            //     Message: {
            //         Subject: {
            //             Data: subject,
            //         },
            //         Body: {
            //             Text: {
            //                 Data: body_text,
            //             },
            //         }
            //     },
            // };

            //Try to send the email.
            // ses.sendEmail(params, function (err, data) {
            //     // If something goes wrong, print an error message.

            // });
        }
    })



},


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
        const check = await signUp.findOne({ email: req.body.email })
        if (check === null) {
            res.status(400).json({
                status: false,
                message: 'Email is wrong'
            })
            
        } else {
            const validPassword = await bcrypt.compare(req.body.password, check.password)
            if (validPassword) {
            
                const payload= {
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




    // update the password
    exports.searnea = async (req, res) => {
        try {
            
           

        } catch (error) {
            res.status(400).json(error.message)
        }

    }



    exports.firebase_token = async (req, res) =>{
		var firebase_token = req.body.token;
		var longitude = req.body.longitude;
		var latitude = req.body.latitude
		// console.log(req.user.id)
		var login_id = req.user.id;
		// registerusersModel.index({ location: "2dsphere" });
		registerusersModel.findOne({ _id: ObjectId(login_id) }, (err, userdata) => {
			locationModel.findOne({ userId: ObjectId(login_id) }, (err, locationdata) => {
				if (userdata.user_type == "users") {
					if (locationdata == null) {
						var payload = {
							userId: login_id,
							"loc.type": "Point",
							user_type: "users",
							"loc.coordinates": [{
								longitude,
								latitude,
							}],
							longitude: longitude,
							latitude: latitude
						}
						var NewTicket = new locationModel(payload);
						NewTicket.save(function (err, new_data) {
							return res.status(200).json({
								status: 200,
								message: "Firebase token added successfully",
							});
						})
					} else {
						locationModel.update({
							userId: ObjectId(login_id)
						}, {
							$set: {
								"loc.type": "Point",
								user_type: "users",
								"loc.coordinates": [{
									longitude,
									latitude,
								}],
								longitude: longitude,
								latitude: latitude
							}
						}, function (err, result) {
							return res.status(200).json({
								status: 200,
								message: "Firebase token added successfully",
							});
						})
					}
				} else {
					registerusersModel.findOne({ _id: ObjectId(login_id) }, (err, userdata) => {
						// console.log(userdata.firebase_token == "")
						if (userdata.firebase_token == "") {
							registerusersModel.update({
								_id: ObjectId(login_id)
							}, {
								$set: {
									firebase_token: firebase_token,
								}
							}, function (err, result) {
								if (err) return res.send(err);
								return res.status(200).json({
									status: 200,
									message: "Firebase token added successfully",
								});
							})
						} else {
							registerusersModel.update({
								_id: ObjectId(login_id)
							}, {
								$set: {
									firebase_token: firebase_token,
								}
							}, function (err, result) {
								if (err) return res.send(err);
								return res.status(200).json({
									status: 200,
									message: "Firebase token added successfully",
								});
							})
						}
					})
				}
			})
		})
	}









