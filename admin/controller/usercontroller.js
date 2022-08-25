require('dotenv').config()
const bcrypt = require('bcrypt');
const User_signUp = require('../../apis/model/userModel')
const restaurant_model = require('../../apis/model/signup')
const {generateAccessToken,auth } = require('../../services/auth')

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
            message: "Successfully Updated User Details",
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

exports.get_users = async (req, res) => {
    try {
        const result = await signUp.find()
        res.status(200).json({
            status: true,
            message: "Successfully Fetched all users",
            'total': result.length,
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}


// Get user by id
exports.get_usersbyid = async (req, res) => {
    var id = req.params.id
    try {
        const result = await User_signUp.findOne({_id:id})
        res.status(200).json({
            status: true,
            message: "Successfully Fetched  users",
          
            'results': result
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.Accept_status_user = async (req, res) =>{
          
    try {
        const updateResDetails = await User_signUp.findByIdAndUpdate(req.params.id,    {
          
            status: true,
           
        },{new:true})
        res.status(200).json({
            status: true,
            message: "Successfully Updated Resturent status ",
            'results': updateResDetails
        })

    } catch (error) {
        res.status(400).json(error.message)
    }
    

}
exports.Reject_status_user = async (req, res) =>{
          
    try {
        User_signUp.findByIdAndUpdate(
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
