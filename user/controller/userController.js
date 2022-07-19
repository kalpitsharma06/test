require('dotenv').config()
const signUp = require('../model/userModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../../services/auth')

//USER SING UP
exports.addUser = async function (req, res, next) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const singupRecords = new signUp({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        password: hashedPassword,
        status: true,
        is_registered: true,
        user_type: 'user'
    })

    try {
        const check = await signUp.findOne({ $or: [{ mobile: req.body.mobile }, { email: req.body.email }] })
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

//Update User Details
exports.updateUser = async (req, res) => {
    try {
        const updateUserDetails = await signUp.findByIdAndUpdate(req.params.id, {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            mobile: req.body.mobile,
            address: req.body.address,
            password: req.body.password,
        })
        res.status(200).json({
            status: true,
            message: "Successfully Updated Resturent details",
            'results': updateUserDetails
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

// Delete User 
exports.deleteUser = async (req, res) => {
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
                    password: req.body.password
                });

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




