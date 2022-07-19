require('dotenv').config()
const signUp = require('../model/login')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(userPayload) {
    return jwt.sign(userPayload, process.env.TOKEN_SECRET);
}

// SING UP
exports.admindetails = async function (req, res, next) {
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
exports.changePassword = async (req, res) => {
    try {
        const databasePassword = await signUp.findById(req.params.id)
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
        const validPassword = await bcrypt.compare(req.body.currPassword, databasePassword.password)

        if (validPassword) {
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

                res.cookie("access_token", token, {
                    httpOnly: true
                })

                res.status(200).json({
                    status: true,
                    message: 'Successfully Signed in',
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


exports.logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out 😏 🍀" });
};

