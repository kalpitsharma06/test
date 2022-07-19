require('dotenv').config()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registeruserModel = require('../../vendor/model/signup')

function generateAccessToken(userPayload) {
    return jwt.sign(userPayload, process.env.TOKEN_SECRET);
}

exports.create_vendor = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let restaurant_name = req.body.restaurant_name;
    let restaurant_address = req.body.restaurant_address;
    let contact_number = req.body.contact_number;
    let email = req.body.email;
    let password = hashedPassword;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let primary_cuisine = req.body.primary_cuisine;
    let secoundry_cuisine = req.body.secoundry_cuisine;
    let photo_id = req.files.photo_id[0].filename;
    let proof_of_ownership = req.files.proof_of_ownership[0].filename;
    let shop_image_front = req.files.shop_image_front[0].filename;
    let foot_hygiene_registration = req.files.foot_hygiene_registration[0].filename;
    let menu = req.files.menu[0].filename;
    let restaurant_logo = req.files.restaurant_logo[0].filename;
    let bank_details = req.body.bank_details;
    let address_of_welcome_pack = req.body.address_of_welcome_pack;
    let account_holder_type = req.body.account_holder_type;
    let account_holder_name = req.body.account_holder_name;
    let routing_number = req.body.routing_number;
    let account_number = req.body.account_number;
    let bank_name = req.body.bank_name;
    let bank_id = req.body.bank_id;
    let type = "vendor";

    //console.log("req", req)
    if (req.method === 'POST') {
        const check = await registeruserModel.findOne({ email: email })
        console.log(check)

        if (check == null) {
            var serachap = {
                restaurant_name: restaurant_name,
                restaurant_address: restaurant_address,
                contact_number: contact_number,
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                primary_cuisine: primary_cuisine,
                secoundry_cuisine: secoundry_cuisine,
                photo_id: photo_id,
                proof_of_ownership: proof_of_ownership,
                shop_image_front: shop_image_front,
                foot_hygiene_registration: foot_hygiene_registration,
                menu: menu,
                restaurant_logo: restaurant_logo,
                bank_details: bank_details,
                address_of_welcome_pack: address_of_welcome_pack,
                account_holder_type: account_holder_type,
                account_holder_name: account_holder_name,
                routing_number: routing_number,
                account_number: account_number,
                bank_name: bank_name,
                bank_id: bank_id,
                type: "vendor",

            };
            var New_User = new registeruserModel(serachap);

            New_User.save()
            res.status(200).json({
                status: true,
                message: "Successfully added Resturent details",
                'results': New_User
            })}
            else {
                res.status(400).json({
                    status: false,
                    message: "Restaurent already exist",
                    'results': New_User
                })}
                
            }
        else {
            res.render('vendor/create_vendor', {
                title: 'FeedMe | Create Vendor',
                layout: 'main',
            });
        }

    };

  


    exports.edit_vendor = async (req, res) => {
        console.log("req.params.id")
        try {
            const updateResDetails = await registeruserModel.findByIdAndUpdate(req.params.id,{
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
                bank_id: req.body.bank_id,
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



    exports.delete_vendor = async (req, res) => {
        try {
            const result = await registeruserModel.findByIdAndDelete(req.params.id)
            res.status(200).json({
                status: true,
                message: "Successfully Deleted ",
                'results': result
            })
    
        } catch (error) {
            res.status(400).json(error.message)
        }
    }




