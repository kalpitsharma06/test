require('dotenv').config()
const signUp = require('../model/signup')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateAccessToken} = require('../../services/auth')

// SING UP
exports.addResturent = async function (req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const singupRecords = new signUp({
        restaurant_name: req.body.restaurant_name,
        restaurant_address: req.body.restaurant_address,
        contact_number: req.body.contact_number,
        email: req.body.email,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        primary_cuisine: req.body.primary_cuisine,
        secoundry_cuisine: req.body.secoundry_cuisine,
        photo_id: req.files.photo_id[0].filename,
        proof_of_ownership: req.files.proof_of_ownership[0].filename,
        shop_image_front: req.files.shop_image_front[0].filename,
        foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
        menu: req.files.menu[0].filename,
        restaurant_logo: req.files.restaurant_logo[0].filename,
        bank_details: req.body.bank_details,
        address_of_welcome_pack: req.body.address_of_welcome_pack,
        account_holder_type: req.body.account_holder_type,
        account_holder_name: req.body.account_holder_name,
        routing_number: req.body.routing_number,
        account_number: req.body.account_number,
        bank_name: req.body.bank_name,
        bank_id: req.body.bank_id,
        status : true,
        is_registered : true,
        user_type : 'vendor'
    })

    try {
        const check = await signUp.findOne({ $or: [{ contact_number: req.body.contact_number }, { email: req.body.email }] })
        if (check !== null) {
            res.status(400).json('Email or Phone Number Already Registered !')
        } else {
            await singupRecords.save();
            res.status(200).json({
                status: true,
                message: "Successfully Signed up",
                'results': singupRecords,
            })
        }

    } catch (err) {
        res.status(400).json(err.message)
    }
};

//Update Resturent Details
exports.updateResturentDetails = async (req, res) => {
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
            photo_id: req.files.photo_id[0].filename,
            proof_of_ownership: req.files.proof_of_ownership[0].filename,
            shop_image_front: req.files.shop_image_front[0].filename,
            foot_hygiene_registration: req.files.foot_hygiene_registration[0].filename,
            menu: req.files.menu[0].filename,
            restaurant_logo: req.files.restaurant_logo[0].filename,
            bank_details: req.body.bank_details,
            address_of_welcome_pack: req.body.address_of_welcome_pack,
            account_holder_type: req.body.account_holder_type,
            account_holder_name: req.body.account_holder_name,
            routing_number: req.body.routing_number,
            account_number: req.body.account_number,
            bank_name: req.body.bank_name,
            bank_id: req.body.bank_id
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
                const token = generateAccessToken({
                    email: req.body.email,
                    contact_number: req.body.contact_number,
                    password: req.body.password
                });
                
                res.status(200).json({
                    status: true,
                    message: 'Successfully Signed in',
                    'user_type' : check.user_type,
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




