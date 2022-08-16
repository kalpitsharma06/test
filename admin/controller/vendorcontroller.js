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











