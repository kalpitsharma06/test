require('dotenv').config()
const User_signUp = require('../model/userModel')
const subCategory = require('../../admin/model/subCategory')
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



exports.Search = async(req,res)=>{
try{

    let data = await subCategory.find({
        "$or":[
            {sub_category_name:{$regex:req.params.key}}
        ]
         })
       .select({sub_category_name:1})
         res.status(200).json({
            status:"true..",
            result:data
         })
}
catch(error){
    res.status(400).json(error.message)
}





}


exports.logout = (req, res) => {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out  🍀" });
};



