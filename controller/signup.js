require('dotenv').config()
const signUp = require('../model/signup')
const bcrypt = require('bcrypt');


// SING UP
exports.addResturent = async function (req, res, next) {
    const { restaurant_name, restaurant_address, contact_number, email } = req.body
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const singupRecords = new signUp({
        restaurant_name: restaurant_name,
        restaurant_address: restaurant_address,
        contact_number: contact_number,
        email: email,
        password: hashedPassword
    })

    try {
        const check = await signUp.findOne({ $or: [{ contact_number: contact_number }, { email: email }] })
        if (check !== null) {
            res.status(400).json('Email or Phone Number Already Registered !')
        } else {
            await singupRecords.save();
            res.status(200).json({
                'status': 200,
                'message': "Successfully Signed up",
                'results': singupRecords,
            })
        }

    } catch (err) {
        res.status(400).json(err.message)
    }
};


//Update Resturent Details
exports.updateResturentDetails = async (req, res) => {
    const { id } = req.params
    const { restaurant_name, restaurant_address, contact_number, email } = req.body
    try {
        const updateResDetails = await signUp.findByIdAndUpdate(id, {
            restaurant_name: restaurant_name,
            restaurant_address: restaurant_address,
            contact_number: contact_number,
            email: email,
        })
        res.status(200).json({
            'status': 200,
            'message': "Successfully Updated Resturent details",
            'results': updateResDetails
        })

    } catch (error) {
        res.status(400).json(err.message)
    }

}

// update the password
exports.updatePassword = async (req, res) => {
    const { id } = req.params
    try {
        currPassword = req.body.currPassword
        newPassword = req.body.newPassword
        const databasePassword = await signUp.findById(id)

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const validPassword = await bcrypt.compare(currPassword, databasePassword.password)

        if (validPassword) {
            await signUp.findByIdAndUpdate(id, { password: hashedPassword })
            res.status(200).json({
                'message': "Successfully Updated Password",
            })

        } else {
            res.status(400).json({
                'message': "Entered Current Password is wrong",
            })
        }

    } catch (error) {
        res.status(400).json(error.message)
    }

}



// Login
exports.logIn = async (req, res) => {
    const { email, password } = req.body
    try {
        const check = await signUp.findOne({ email: email })
        if (check === null) {
            res.status(400).json('Email is wrong')

        } else {

            const validPassword = await bcrypt.compare(req.body.password, check.password)
            if (validPassword) {
                res.status(200).json('Successfully Signed in')
            } else {
                res.status(400).json('password is wrong')
            }
        }

    } catch (err) {
        res.status(400).json(err.message)
    }

}




