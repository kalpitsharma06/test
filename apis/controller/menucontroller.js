require('dotenv').config()
const signUp = require('../model/userModel')
const subCategory = require('../../admin/model/subCategory')
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
// const { find } = require('../model/signup');
let itemModel = require('../../apis/model/item').item;
const registerusersModel = require('../model/signup')

   



exports.create_menu=(req, res)=> {
    var reqdata = req.body;
    var category = reqdata.category;
    var menu_type = reqdata.menu_type;
    var price = reqdata.price;
    var quantity = reqdata.quantity;
    var image = req.file.originalname;
    var offer_price = reqdata.offer_price
 
    var menu_description = reqdata.menu_description;
    // var vendorId = req.user.id;
     var id = req.params.id
    registerusersModel.findOne({ _id: id }, (err, userdata) => {
        console.log(userdata)

             var restro_name = "hello"
         var type = reqdata.type
        // var errors = req.validationErrors();
        let menu = new itemModel();
        menu.parent = category,
            menu.products.menu_type = menu_type,
            menu.products.menu_description = menu_description,
            menu.products.price = price,
            menu.products.quantity = quantity,
            menu.products.image = image,
            menu.vendorId = req.params.id,
            menu.products.type = type,
            menu.products.offer_price = offer_price,
            menu.products.restro_name = restro_name
        itemModel.findOne({ vendorId: vendorId, parent: category }, (err, itemdata) => {
            console.log(itemdata)
            if (itemdata == null) {
                const payload = {
                    parent: category,
                    vendorId: vendorId,
                    products: [{ menu_type, menu_description, price, quantity, image, type, restro_name, offer_price }],
                };
                console.log(payload)
                var NewTicket = new itemModel(payload);
                NewTicket.save(function (err, obj) {
                    if (err) throw err;
                    return res.status(200).json({
                        success: true,
                        message: "Item created successfully",
                        payload: payload
                    });
                });
            } else {
                if (itemdata.vendorId == vendorId && itemdata.parent == category) {
                    var itemid = itemdata._id;
                    itemdata.products.push({ menu_type, menu_description, price, quantity, image, type, restro_name, offer_price });
                    itemdata = itemdata.save();
                    return res.status(200).json({
                        status: 200,
                        message: "item updated successfully successfully."
                    });
                }
            }
        })
    })

}