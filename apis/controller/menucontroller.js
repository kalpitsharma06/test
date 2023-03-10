require('dotenv').config();
console.log("kkkkkkkkkkkkkkkkkk")
const signUp = require('../model/userModel');
const subCategoryModel = require('../../admin/model/subCategory');
const categorymodel = require('../../admin/model/category');
const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../../services/auth');
// const { find } = require('../model/signup');
let itemModel = require('../../apis/model/item').item;
let comboModel = require('../../apis/model/combo').combo;
const registerusersModel = require('../model/signup');
const signup = require('../model/signup');
const cartModel = require('../model/cart').cart;
exports.create_menu = async (req, res) => {
  // var subCategory_id = req.params.id
  var restro_id = req.user.id;

  console.log(restro_id);

  try {
    var reqdata = req.body;

    var subCategory = reqdata.subcategory;
    var subCategory_id = reqdata.subcategory_id;
 
    var category = reqdata.category;
    var Product_name = reqdata.Product_name;
    var Product_description = reqdata.Product_description;
    var price = reqdata.price;
    var category_id =reqdata.category_id;
    var quantity = reqdata.quantity;
    var image = req.file.location;
    var offer_price = reqdata.offer_price;
    var status = 'Active';
    registerusersModel.findOne({ _id: restro_id }, (err, restrodate) => {
      console.log(restrodate, 'jjjjj');
      if (restrodate) {
        var restro_name = restrodate.restaurant_name;
        var type = restrodate.user_type;

        let menu = new itemModel();
        (menu.category = category),
          (menu.status = status),
          (category_id =category_id),
         (subCategory_id=subCategory_id),
          (menu.subCategory = subCategory),
          (menu.Product_name = Product_name),
          (menu.Product_description = Product_description),
          (menu.price = price),
          (menu.quantity = quantity),
          (menu.image = image),
          (menu.vendorId = restro_id),
          (menu.type = type),
          (menu.offer_price = offer_price),
          (menu.restro_name = restro_name);

        if (image) {
          var payload = {
            category: category,
            status: status,
            vendorId: restro_id,
            subCategory: subCategory,
            Product_name: Product_name,
            Product_description: Product_description,
            price: price,
            category_id:category_id,
            subCategory_id:subCategory_id,


            quantity: quantity,
            image: image,
            type: type,
            restro_name: restro_name,
            offer_price: offer_price,
          };
        } else {
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
            offer_price: offer_price,
          };
        }

        var NewTicket = new itemModel(payload);
        NewTicket.save(function (err, obj) {
          if (err) throw err;
          return res.status(200).json({
            success: true,
            message: 'Item created successfully',
            payload: payload,
          });
        });
        // console.log(itemdata)
      } else {
        res.status(400).json({
          status: false,
          result: err,
          message: '  menu creation unsuccessfull ',
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      result: err.message,
      message: '  menu creation unsuccessfull ',
    });
  }
};
exports.search_product = async (req, res) => {
  var key = req.body.key;
  console.log(key);
  newkey = new RegExp(key, 'i');
  try {
    if (req.body.key) {
      let data = await itemModel.find({
        $or: [
          { Product_name: { $regex: newkey } },
          { subCategory: { $regex: newkey } },
          { category: { $regex: newkey } },
        ],
      });

      if (data.length > 0) {
        res.status(200).json({
          status: true,
          message: data,
        });
      } else {
        res.status(400).json({
          status: false,
          message: 'No Products avialable',
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: 'No resrautrants avialable',
    });
  }
};

// exports.create_menu = async (req, res) => {
//   var subCategory_id = req.params.id;
//   var restro_id = req.user.id

//   try {
//     subCategoryModel.findOne({ _id: subCategory_id }, (err, subCategorydata) => {
//       var subCategory_name = subCategorydata.sub_category_name;

//       var category_id = subCategorydata.category;

//       categorymodel.findOne({ _id: category_id }, (err, userdata) => {
//         console.log(userdata);
//         if (err) throw err;
//         var reqdata = req.body;
//         var restro_id = userdata.restaurant_id;

//         var subCategory = subCategory_name;
//         var reqdata = req.body;
//         var category = req.body.category;
//         var Product_name = reqdata.Product_name;
//         var Product_description = reqdata.Product_description;
//         var price = reqdata.price;
//         var quantity = reqdata.quantity;
//         var image = req.file.location;
//         var offer_price = reqdata.offer_price;
//         var status = 'Active';
//         registerusersModel.findOne({ _id: restro_id }, (err, restrodate) => {
//           console.log(restrodate, 'jjjjj');
//           if (restrodate) {
//             var restro_name = restrodate.restaurant_name;
//             var type = restrodate.user_type;

//             let menu = new itemModel();
//             (menu.category = category),
//               (menu.status = status),
//               (menu.subCategory = subCategory),
//               (menu.Product_name = Product_name),
//               (menu.Product_description = Product_description),
//               (menu.price = price),
//               (menu.quantity = quantity),
//               (menu.image = image),
//               (menu.vendorId = restro_id),
//               (menu.type = type),
//               (menu.offer_price = offer_price),
//               (menu.restro_name = restro_name);

//             itemModel.findOne({ subCategory: subCategory }, (err, itemdata) => {
//               if (image) {
//                 var payload = {
//                   category: category,
//                   status: status,
//                   vendorId: restro_id,
//                   subCategory: subCategory,
//                   Product_name: Product_name,
//                   Product_description: Product_description,
//                   price: price,

//                   quantity: quantity,
//                   image: image,
//                   type: type,
//                   restro_name: restro_name,
//                   offer_price: offer_price,
//                 };
//               } else {
//                 var payload = {
//                   category: category,
//                   status: status,
//                   vendorId: restro_id,
//                   subCategory: subCategory,
//                   Product_name: Product_name,
//                   Product_description: Product_description,
//                   price: price,

//                   quantity: quantity,

//                   type: type,
//                   restro_name: restro_name,
//                   offer_price: offer_price,
//                 };
//               }

//               var NewTicket = new itemModel(payload);
//               NewTicket.save(function (err, obj) {
//                 if (err) throw err;
//                 return res.status(200).json({
//                   success: true,
//                   message: 'Item created successfully',
//                   payload: payload,
//                 });
//               });
//               console.log(itemdata);
//             });
//           } else {
//             res.status(400).json({
//               status: false,
//               result: err,
//               message: '  menu creation unsuccessfull ',
//             });
//           }
//         });
//       });
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: false,
//       result: err.message,
//       message: '  menu creation unsuccessfull ',
//     });
//   }
// };

exports.create_combos = async (req, res) => {
  // console.log(req.file.image)
  try {
    // console.log(user)

    var reqdata = req.body;
    var product_id = req.body.product_id;
    var user = req.user.id;
    signup.findOne({ _id: user }, (err, restrodata) => {
      var vendor_id = user;

      itemModel.findOne({ _id: product_id }, (err, productdata) => {
        var reqdata = req.body;
        // console.log(productdata)
        // var product_id = req.body.product_id
        // var user = req.user.id
        var item_name = reqdata.item_name;
        var item_price = reqdata.item_price;
        var item_image = req.file.location;
        var item_description = reqdata.item_description;
        var Product_name = productdata.Product_name;
        var Product_description = productdata.Product_description;
        var price = productdata.price;
        var quantity = productdata.quantity;
        var image = productdata.image;
        var type = productdata.type;
        var offer_price = productdata.offer_price;

        let menu = new comboModel();
        (menu.Item_name = item_name),
          (menu.Item_price = item_price),
          (menu.Item_image = item_image),
          (menu.Item_description = item_description),
          (menu.products.Product_name = Product_name),
          (menu.products.Product_description = Product_description),
          (menu.products.price = price),
          (menu.products.quantity = quantity),
          (menu.products.image = image),
          (menu.vendorId = vendor_id),
          (menu.products.type = type),
          (menu.products.offer_price = offer_price);

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
            combo_data.save(function (err, obj) {
              if (err) throw err;
              return res.status(200).json({
                success: true,
                message: 'item updated successfully',
                payload: combo_data,
              });
            });
          } else {
            var NewTicket = new comboModel(payload);
            NewTicket.save(function (err, obj) {
              if (err) throw err;
              return res.status(200).json({
                success: true,
                message: 'Item created successfully',
                payload: payload,
              });
            });
          }
        });
      });
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'add to combo unseccessfull.',
    });
  }
};
exports.getall_combo = async (req, res) => {
  const id = { _id: req.params.id };

  comboModel.find({ vendorId: id }, (err, data) => {
    if (err) {
      res.status(200).json({
        msg: 'no combo exist',
        status: false,
        err: err.message,
      });
    } else {
      res.status(200).json({
        msg: 'combo successfully',
        status: true,
        Data: data,
      });
    }
  });

  //   })
};
exports.delete_combo = async (req, res) => {
  const id = { _id: req.params.id };

  comboModel.findOneAndDelete(id, (err, data) => {
    if (err) {
      res.status(200).json({
        msg: 'no combo exist',
        status: false,
        err: err.message,
      });
    } else {
      res.status(200).json({
        msg: 'delete  combo successfully',
        status: true,
      });
    }
  });

  //   })
};
exports.delete_combo_item = async (req, res) => {
  const id = { _id: req.params.id };
  const { productId_no } = req.body;

  comboModel.updateOne(id, { $pull: { products: { _id: req.body.productId_no } } }, (err, data) => {
    if (err) {
      res.status(200).json({
        msg: 'no data exist',
        status: false,
        err: err.message,
      });
    } else {
      res.status(200).json({
        msg: 'delete  data successfully',
        status: true,
        data: data,
      });
    }
  });

  //   })
};

exports.edit_product = async (req, res) => {
  var reqdata = req.body;

  // const {user} = req;
  // var id = user.id;
  const id = req.params.id;

  try {
    if (req.file) {
      var newData = await itemModel.findByIdAndUpdate(req.params.id, {
        category: reqdata.category,
        sub_Category: reqdata.sub_category,
        type: reqdata.type,
        price: reqdata.price,
        image: req.file.location,
        quantity: reqdata.quantity,
        Product_name: reqdata.Product_name,
        Product_description: reqdata.Product_description,
      });
    } else {
      newData = await itemModel.findByIdAndUpdate(req.params.id, {
        category: reqdata.category,
        sub_Category: reqdata.sub_category,
        type: reqdata.type,
        price: reqdata.price,
        quantity: reqdata.quantity,
        Product_name: reqdata.Product_name,
        Product_description: reqdata.Product_description,
      });
    }

    res.status(200).json({
      success: true,

      message: 'Item updated successfully',
      result: newData,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      status: 400,
      message: 'Item update unsuccessfull',
      err: err.message,
    });
  }
};
exports.get_productsdetails = async (req, res) => {
  // var reqdata = req.body;
  var _id = req.params.id;
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
  itemModel.findOne({ _id }, (err, userdata) => {
    if (err) {
      res.status(400).json({
        msg: 'no product exist',
        status: false,
        err: err.message,
      });
    } else {
      console.log(userdata);
      return res.status(200).json({
        success: true,
        data: userdata,
        message: ' menu details loaded',
      });
    }
  });
};

exports.get_productsbysubcategory = async (req, res) => {
  var vendorId = req.params.id;
  var subCategory = req.body.subCategory;
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
  itemModel.find({ vendorId: vendorId, subCategory: subCategory }, (err, userdata) => {
    if (userdata.length == 0) {
      res.status(400).json({
        msg: 'no product exist',
        status: false,
      });
    } else {
      console.log(userdata);
      return res.status(200).json({
        success: true,
        result: userdata,
        message: ' menu details loaded',
      });
    }
  });
};

exports.delete_product = async (req, res) => {
  const product_id = req.params.id;

  itemModel.findByIdAndDelete({ _id: product_id }, (err, data) => {
    if (data) {
      const vendorid =  data.vendorId;
      //  cartModel.find(vendorid)
      

      cartModel.updateOne({vendorId:vendorid}, { $pull: { products: { productId: product_id } } }, (err, cart_data) => {
        console.log(cart_data)
        if (cart_data) {
          return res.status(200).json({
            success: true,
            data: cart_data,
            message: 'product deleted from menu & cart',
          });
        } else {
          return res.status(200).json({
            success: true,
            data: data,
            message: 'product deleted from menu ',
          });
        }
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: 'No items to delete',
      });
    }
  });
};
exports.category_listing = async (req, res) => {
  var reqdata = req.body;

  categorymodel.find({}, (err, userdata) => {
    return res.status(200).json({
      success: true,
      data: userdata,
      message: 'Category listing loaded',
    });
  });
};
exports.getall_products = async (req, res) => {
  // var reqdata = req.body;
  var vendor_id = req.params.id;
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
    console.log(userdata);
    if (err) {
      res.status(400).json({
        msg: 'no product exist',
        status: false,
        err: err.message,
      });
    } else {
      console.log(userdata);
      return res.status(200).json({
        success: true,
        result: userdata,
        message: ' menu details loaded',
      });
    }
  });
};

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
