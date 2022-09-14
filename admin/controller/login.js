require('dotenv').config()
const signUp = require('../model/login')
const bcrypt = require('bcrypt');
const auth = require("../../services/auth")
const jwt = require('jsonwebtoken');




// SING UP
exports.admindetails = async function (req, res, next) {
    console.log(req.body)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const singupRecords = new signUp({
        email: req.body.email,
        password: hashedPassword,
    })

    try {
        await singupRecords.save();
        res.status(200).json({
            status: true,
            message: "Successfully Signed up",
            'results': singupRecords,
        })
    }

    catch (err) {
        res.status(400).json(err.message)
    }
};

// update the password
exports.change_Password = async (req, res) => {
    try {
        const databasePassword = await signUp.findById(req.user.id)
        const hashedPassword = await bcrypt.hash(req.body.new_Password, 10)
        const validPassword = await bcrypt.compare(req.body.current_Password, databasePassword.password)

        if (validPassword) {
            const results = await signUp.findByIdAndUpdate(req.user.id, { password: hashedPassword })
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
                    'token': token,
                    email :payload                 
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


exports.logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out  🍀" });
};

