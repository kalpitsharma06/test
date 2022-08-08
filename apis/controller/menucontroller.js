require('dotenv').config()
const signUp = require('../model/userModel')
const subCategoryModel = require('../../admin/model/subCategory')
const categorymodel = require('../../admin/model/category')
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
// const { find } = require('../model/signup');
let itemModel = require('../../apis/model/item').item;
let comboModel = require('../../apis/model/combo').combo;
const registerusersModel = require('../model/signup');
const signup = require('../model/signup');





exports.create_menu = async (req, res) => {

    // console.log(req.file.filename)
    var subCategory_id = req.params.id
    try {
        subCategoryModel.findOne({ _id: subCategory_id }, (err, subCategorydata) => {
            console.log(subCategorydata)
            var subCategory_name = subCategorydata.sub_category_name

            var category_id = subCategorydata.category

            console.log(subCategorydata)
            categorymodel.findOne({ _id: category_id }, (err, userdata) => {
                var reqdata = req.body
                console.log(userdata)
                var restro_id = userdata.restaurant_id;

                var subCategory = subCategory_name;
                var reqdata = req.body;
                var category = userdata.category_name;
                var Product_name = reqdata.Product_name;
                var Product_description = reqdata.Product_description;
                var price = reqdata.price;
                var quantity = reqdata.quantity;
                var image = req.file.filename;
                var offer_price = reqdata.offer_price
                var status = "Active"



                registerusersModel.findOne({ _id: restro_id, }, (err, restrodate) => {


                    var restro_name = restrodate.restaurant_name
                    var type = restrodate.user_type
                    // var errors = req.validationErrors();
                    let menu = new itemModel();
                    menu.category = category,
                        menu.status = status,
                        menu.subCategory = subCategory,
                        menu.Product_name = Product_name,
                        menu.Product_description = Product_description,
                        menu.price = price,
                        menu.quantity = quantity,
                        menu.image = image,
                        menu.vendorId = restro_id,
                        menu.type = type,
                        menu.offer_price = offer_price,
                        menu.restro_name = restro_name



                    itemModel.findOne({ subCategory: subCategory }, (err, itemdata) => {

                        // if (itemdata == null) {
                        if (image) {

                            var payload = {
                                category: category,
                                status: status,
                                vendorId: restro_id,
                                subCategory: subCategory,
                                Product_name: Product_name,
                                Product_description: Product_description,
                                price: price,

                                quantity: quantity,
                                image: image,
                                type: type,
                                restro_name: restro_name,
                                offer_price: offer_price
                            }
                        }

                        else {
                            var payload = {
                                category: category,
                                status: status,
                                vendorId: restro_id,
                                subCategory: subCategory,
                                Product_name: Product_name,
                                Product_description: Product_description,
                                price: price,

                                quantity: quantity,

                                type: type,
                                restro_name: restro_name,
                                offer_price: offer_price
                            }
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
                        // } 
                        // else {
                        //     if (itemdata.subCategory == subCategory) {
                        //         if (image) {

                        //             itemdata.products.push({ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price });
                        //             itemdata.save();
                        //         } else {
                        //             itemdata.products.push({ Product_name, Product_description, price, quantity, type, restro_name, offer_price });
                        //             itemdata.save();
                        //         }

                        //         return res.status(200).json({
                        //             status: 200,
                        //             message: "item updated successfully successfully.",
                        //             result: itemdata
                        //         });
                        //     }
                        // }
                    })

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

exports.create_combos = async (req, res) => {

    // console.log(req.file.image)

    var reqdata = req.body
    var product_id = req.body.product_id
    var user = req.user.id
    try { // console.log(user)
        signup.findOne({ _id: user }, (err, restrodata) => {
            var vendor_id = user





            itemModel.findOne({ _id: product_id }, (err, productdata) => {
                var reqdata = req.body
                // console.log(productdata)
                var product_id = req.body.product_id
                // var user = req.user.id
                var item_name = reqdata.item_name
                var item_price = reqdata.item_price
                var item_image = req.file.filename
                var item_description = reqdata.item_description
                var Product_name = productdata.Product_name
                var Product_description = productdata.Product_description
                var price = productdata.price
                var quantity = productdata.quantity
                var image = productdata.image
                var type = productdata.type
                var offer_price = productdata.offer_price






                let menu = new comboModel();
                menu.Item_name = item_name,
                    menu.Item_price = item_price,
                    menu.Item_image = item_image,
                    menu.Item_description = item_description,


                    menu.products.Product_name = Product_name,
                    menu.products.Product_description = Product_description,
                    menu.products.price = price,
                    menu.products.quantity = quantity,
                    menu.products.image = image,
                    menu.vendorId = vendor_id,
                    menu.products.type = type,
                    menu.products.offer_price = offer_price



                var payload = {
                    Item_name: item_name,
                    Item_price: item_price,
                    Item_image: item_image,
                    Item_description: item_description,
                    vendorId: vendor_id,

                    // vendorId: restro_id,
                    // subCategory: subCategory,
                    products: [{ Product_name, Product_description, price, quantity, image, type, offer_price }],
                };

                comboModel.findOne({ item_name: item_name }, (err, combo_data) => {
                    if (combo_data) {

                        combo_data.products.push({ Product_name, Product_description, price, quantity, type, offer_price });
                        combo_data.save(
                            (function (err, obj) {
                                if (err) throw err;
                                return res.status(200).json({
                                    success: true,
                                    message: "item updated successfully",
                                    payload: combo_data
                                })

                            })

                        );

                    }
                    else {
                        var NewTicket = new comboModel(payload);
                        NewTicket.save(
                            (function (err, obj) {
                                if (err) throw err;
                                return res.status(200).json({
                                    success: true,
                                    message: "Item created successfully",
                                    payload: payload
                                });
                            }));

                    }



                })
 })
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "add to combo unseccessfull.",

        });
    }
}

exports.edit_product = async (req, res) => {
    var reqdata = req.body;
    // const {user} = req;
    // var id = user.id;
    const id = req.params.id;

    try {
        const newData = await itemModel.findByIdAndUpdate(req.params.id, {
            category: reqdata.category,
            sub_Category: reqdata.sub_category,
            type: reqdata.type,
            price: reqdata.price,
            image: reqdata.image,
            quantity: reqdata.quantity,
            Product_name: reqdata.Product_name,
            Product_description: reqdata.Product_description,
        })

        res.status(200).json({
            success: true,

            message: "Item updated successfully",
            result: newData
        })
    }
    catch (err) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "Item update unsuccessfull",


        })
    }

};



exports.delete_product = async (req, res) => {

    const product_id = req.params.id;

    itemModel.findByIdAndDelete({ _id: product_id }, (err, data) => {
        console.log(data)
        if (data == null) {
            return res.status(200).json({
                status: 200,
                message: "No items to delete"
            });
        }
        else {

            return res.status(200).json({
                status: 200,
                message: "item deleted successfully"
            });
        }

    })
},


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




























// exports.create_menu = async (req, res) => {



//     // console.log(req.file.filename)
//     var subCategory_id = req.params.id
//     try {
//         subCategoryModel.findOne({ _id: subCategory_id }, (err, subCategorydata) => {
//             console.log(subCategorydata)
//             var subCategory_name = subCategorydata.sub_category_name

//             var category_id = subCategorydata.category

//             console.log(subCategorydata)
//             categorymodel.findOne({ _id: category_id }, (err, userdata) => {
//                 var reqdata = req.body
//                 console.log(userdata)
//                 var restro_id = userdata.restaurant_id;

//                 var subCategory = subCategory_name;
//                 var reqdata = req.body;
//                 var category = userdata.category_name;
//                 var Product_name = reqdata.Product_name;
//                 var Product_description = reqdata.Product_description;
//                 var price = reqdata.price;
//                 var quantity = reqdata.quantity;
//                 var image = req.file.filename;
//                 var offer_price = reqdata.offer_price
//                 var status = "Active"



//                 registerusersModel.findOne({ _id: restro_id, }, (err, restrodate) => {


//                     var restro_name = restrodate.restaurant_name
//                     var type = restrodate.user_type
//                     // var errors = req.validationErrors();
//                     let menu = new itemModel();
//                     menu.parent = category,
//                         menu.status = status,
//                         menu.subCategory = subCategory,
//                         menu.products.Product_name = Product_name,
//                         menu.products.Product_description = Product_description,
//                         menu.products.price = price,
//                         menu.products.quantity = quantity,
//                         menu.products.image = image,
//                         menu.vendorId = restro_id,
//                         menu.products.type = type,
//                         menu.products.offer_price = offer_price,
//                         menu.products.restro_name = restro_name



//                     itemModel.findOne({ subCategory: subCategory }, (err, itemdata) => {

//                         // if (itemdata == null) {
//                         if (image) {

//                             var payload = {
//                                 parent: category,
//                                 status: status,
//                                 vendorId: restro_id,
//                                 subCategory: subCategory,
//                                 products: [{ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price }],
//                             };
//                         } else {
//                             var payload = {
//                                 parent: category,
//                                 status: status,
//                                 subCategory: subCategory,
//                                 vendorId: vendorId,
//                                 products: [{ Product_name, Product_description, price, quantity, type, restro_name, offer_price }],
//                             };
//                         }
//                         // console.log(products,"!1111")
//                         var NewTicket = new itemModel(payload);
//                         NewTicket.save(
//                             (function (err, obj) {
//                                 if (err) throw err;
//                                 return res.status(200).json({
//                                     success: true,
//                                     message: "Item created successfully",
//                                     payload: payload
//                                 });
//                             }));
//                         console.log(itemdata)
//                         // }
//                         // else {
//                         //     if (itemdata.subCategory == subCategory) {
//                         //         if (image) {

//                         //             itemdata.products.push({ Product_name, Product_description, price, quantity, image, type, restro_name, offer_price });
//                         //             itemdata.save();
//                         //         } else {
//                         //             itemdata.products.push({ Product_name, Product_description, price, quantity, type, restro_name, offer_price });
//                         //             itemdata.save();
//                         //         }

//                         //         return res.status(200).json({
//                         //             status: 200,
//                         //             message: "item updated successfully successfully.",
//                         //             result: itemdata
//                         //         });
//                         //     }
//                         // }
//                     })

//                 })
//             })
//         })
//     } catch (err) {
//         res.status(400).json({
//             status: false,
//             'result': (err.message),
//             'message': "  menu creation unsuccessfull "

//         })
//     }
// }















// }