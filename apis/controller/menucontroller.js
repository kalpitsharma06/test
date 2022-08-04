require('dotenv').config()
const signUp = require('../model/userModel')
const subCategory = require('../../admin/model/subCategory')
const categorymodel = require('../../admin/model/category')
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
// const { find } = require('../model/signup');
let itemModel = require('../../apis/model/item').item;
const registerusersModel = require('../model/signup')



// from restro pov

// exports.create_menu= async(req, res)=> {

// // taking resturant id from user (restaurant//)


//     var restro_id = req.params.id
//     registerusersModel.findOne({ _id:  restro_id,}, (err, restrodate) => {
// var reqdata = req.body
// var type = restrodate.user_type
// var restro_id=restrodate.id;
// var restro_name=restrodate.restarant_name

// var reqdata = req.body;
// var item_name= req.body.item_name;
// // var category = userdata.category_name;
// var Product_name = reqdata.Product_name;
// var price = reqdata.price;
// var quantity = reqdata.quantity;
// var image = req.file.filename;
// var offer_price = reqdata.offer_price

// var Product_description = reqdata.Product_description;

// check if categary is 
// categorymodel.findOne({ restaurant_id: restro_id ,}, (err, userdata) =>{




//                         var category = userdata.category_name;
//                         let menu = new itemModel();
//                         menu.parent = category,
//                         menu.products.item_name = item_name,
//                             menu.products.Product_name = Product_name,
//                             menu.products.Product_description = Product_description,
//                             menu.products.price = price,
//                             menu.products.quantity = quantity,
//                             menu.products.image = image,

//                             menu.products.type = type,
//                             menu.products.offer_price = offer_price,
//                             menu.products.restro_name = restro_name



//                             itemModel.findOne({ item_name:item_name }, (err, itemdata) => {

//                                         if (itemdata == null) {
//                                             const payload = {
//                                                 parent: category,
//                                                 item_name: item_name,
//                                                 products: [{ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price }],
//                                             };
//                                             // console.log(products,"!1111")
//                                             var NewTicket = new itemModel(payload);
//                                              NewTicket.save (
//                                              (function (err, obj) {
//                                                 if (err) throw err;
//                                                 return res.status(200).json({
//                                                     success: true,
//                                                     message: "Item created successfully",
//                                                     payload: payload
//                                                 });
//                                             }));
//                                             console.log(itemdata)
//                                         } else {
//                                             if ( itemdata.item_name == item_name) {
//                                                 var itemid = itemdata._id;
//                                                 itemdata.products.push({ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price });
//                                                 itemdata.save();
//                                                  console.log(itemdata,">>>>.");
//                                                 return res.status(200).json({
//                                                     status: 200,
//                                                     message: "item updated successfully successfully.",
//                                                     result:itemdata
//                                                 });
//                                             }
//                                         }
//                                     })





//         })









//     })}

exports.create_menu = async (req, res) => {
   
    

    try{
        console.log(req.file.filename)
    var category_id = req.params.id
    categorymodel.findOne({ _id: category_id }, (err, userdata) => {
        var reqdata = req.body
        console.log(userdata)
        var restro_id = userdata.restaurant_id;

        var item_name = req.body.item_name;
        var reqdata = req.body;
        var category = userdata.category_name;
        var Product_name = reqdata.Product_name;
        var Product_description = reqdata.Product_description;
        var price = reqdata.price;
        var quantity = reqdata.quantity;
        var image = req.file.filename;
        var offer_price = reqdata.offer_price

    
       
        registerusersModel.findOne({ _id: restro_id, }, (err, restrodate) => {


            var restro_name = restrodate.restaurant_name
            var type = restrodate.user_type
            // var errors = req.validationErrors();
            let menu = new itemModel();
            menu.parent = category,
                menu.products.item_name = item_name,
                menu.products.Product_name = Product_name,
                menu.products.Product_description = Product_description,
                menu.products.price = price,
                menu.products.quantity = quantity,
                menu.products.image = image,
                menu.vendorId = req.params.id,
                menu.products.type = type,
                menu.products.offer_price = offer_price,
                menu.products.restro_name = restro_name



            itemModel.findOne({ item_name: item_name }, (err, itemdata) => {

                if (itemdata == null) {
                    if(image){

                        const payload = {
                            parent: category,
                            item_name: item_name,
                            products: [{ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price }],
                        };
                    }else{
                        const payload = {
                            parent: category,
                            item_name: item_name,
                            products: [{ Product_name, Product_description, price, quantity,  type, restro_name, offer_price }],
                        };
                    }
                    // console.log(products,"!1111")
                    var NewTicket = new itemModel(payload);
                    NewTicket.save(
                        (function (err, obj) {
                            if (err) throw err;
                            return res.status(200).json({
                                success: true,
                                message: "Item created successfully",
                                payload: payload
                            });
                        }));
                    console.log(itemdata)
                } else {
                    if (itemdata.item_name == item_name) {
                       if(image){

                           itemdata.products.push({ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price });
                           itemdata.save();
                        }else{
                            itemdata.products.push({ Product_name, Product_description, price, quantity,  type, restro_name, offer_price });
                            itemdata.save();
                        }
                        console.log(itemdata, ">>>>.");
                        return res.status(200).json({
                            status: 200,
                            message: "item updated successfully successfully.",
                            result: itemdata
                        });
                    }
                }
            })

        })
    })
 } catch (err) {
    res.status(400).json({
        status: false,
        'result': (err.message),
        'message': "  menu creation unsuccessfull "

    })
}
}
exports.category_listing = async (req, res) => {
    var reqdata = req.body;


    categorymodel.find({}, (err, userdata) => {
        return res.status(200).json({
            success: true,
            data: userdata,
            message: "Category listing loaded",
        });
    })

},








































exports.getall_products = async (req, res) => {
    // var reqdata = req.body;
    var vendor_id = req.params.id
    // var userId = req.user.id;
    // // favouriteModel.findOne({ userId: userId }, (err, favourite_data) => {
    //     if (favourite_data == null) {
    //         if (vendor_id == '') {
    //             itemModel.find({}, (err, userdata) => {
    //                 return res.status(200).json({
    //                     success: true,
    //                     data: userdata,
    //                     message: "Menu listing loaded",
    //                 });
    //             })
    //         }} else {
    itemModel.find({ vendorId: vendor_id }, (err, userdata) => {
        console.log(userdata)
        return res.status(200).json({
            success: true,
            data: userdata,
            message: "Vendor menu listing loaded",
        });
    })
}

//     })
// }