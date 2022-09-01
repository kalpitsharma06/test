const express = require('express')
const router = express.Router()
const addUser = require('../controller/userController')

const signUp = require('../controller/signup')
const payment = require('../controller/paymentController')
const menu = require('../controller/menucontroller')
const multer = require('multer');
const path = require('path')
const path1 = path.join(__dirname + '../../../public/uploads')
const { auth,   authorization_restro ,apiAuthAuthenticated,authorization_user} = require('../../services/auth');

var multerS3 = require('multer-s3')
const aws = require("aws-sdk")
var s3 = new aws.S3();

aws.config.update({
    secretAccessKey: "xaQwB/3+WOWf5ofmuhacNU95r8aYqzct6YUUu+iD",
    accessKeyId: "AKIARCFXHG3UECAKFKMM",
    region:  "us-east-1",
  });
  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "xntproject/just-eat",
      metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
        file;
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString() + "-" + file.originalname);
      },
    }),
    limits: { fileSize: 10000000 },
  });




// const storage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         callback(null, path1);
//     },
//     filename: function (req, file, callback) {
//         callback(null, Date.now() + file.originalname);
//     },
// });


// const upload = multer({
//     storage: storage,
// });






// const maxsize= 1024*5

// const upload = multer({
//     storage: storage,
//     limits: {maxsize}
// });
const multerArray = [{
    name: 'photo_id', maxCount: 1
}, {
    name: 'proof_of_ownership', maxCount: 1
}, {
    name: 'shop_image_front', maxCount: 1
}, {
    name: 'foot_hygiene_registration', maxCount: 1
}, {
    name: 'permission_to_trade', maxCount: 1
}
, {
    name: 'menu', maxCount: 1
}, {
    name: 'restaurant_logo', maxCount: 1
}
]
// const upload1 = multer({
//     storage: storage,
   
// });
// var multiple_uploads = upload1.fields([{ name: 'photo_id'},{ name: 'proof_of_ownership' }])


// usercontroller

router.post('/adduser',addUser.addUser)
router.patch('/updateuser/:id',authorization_user,addUser.updateUser)
router.get('/get_usersbyid',authorization_user,addUser.get_usersbyid)
router.delete('/deleteuser/:id',authorization_user, addUser.deleteUser)
router.post('/login_user',addUser.logIn)
router.post('/guest_login',addUser.guest_login)
router.get('/cart',authorization_user,addUser.cart)

router.put('/changepassword/:id',authorization_user, addUser.changePassword)
router.post('/search',addUser.Searchby_main)
router.post('/suggestion_main',addUser.suggestion_main)
router.get('/Searchbymealtimming/:key', addUser.Searchby_mealtimming)
router.get('/getrestro_byid/:id',addUser.getrestro_byid);

router.get('/nearbyRestro',addUser.nearbyRestro)
router.post('/cart',authorization_user,addUser.cart);
router.get('/cart_list',authorization_user,addUser.cart_list);
router.get('/cart_clear/:id',authorization_user,addUser.clear_cart);
router.get('/orderlisting',authorization_user,addUser.order_listing);
router.post('/create_order/:id',authorization_user,addUser.create_order);
router.post('/checkout/:id',authorization_user,addUser.checkout);
router.post('/create_order_guest',authorization_user,addUser.create_order_guest);
router.post('/report',authorization_user,addUser.report);

router.post('/addcard',authorization_user,addUser.Addcard)
router.delete('/deletecard/:id',authorization_user, addUser.deleteCard)
router.patch('/updatecard/:id',authorization_user,addUser.updateCard)
router.patch('/contactpreference',authorization_user,addUser.contactPreference)


router.post('/addaddressbook',authorization_user,addUser.add_addressbook)
router.delete('/deleteaddress/:id',authorization_user,addUser.delete_address);
router.patch('/editaddress/:id',authorization_user,addUser.edit_address);


router.post('/addfeedback/:id',authorization_user,addUser.add_feedback)






// vendor controller




router.post('/addrestaurant',signUp.addrestaurant)
router.post('/restro_additionalinfo',authorization_restro,signUp.restaurant_additionalinfo)
router.patch('/verification/:id'
,upload.fields([
    {
    name: 'photo_id', maxCount: 1
}, {
    name: 'proof_of_ownership', maxCount: 1
},
{
   name: 'menu', maxCount: 1
}, ])
,signUp.ownership_verification) 
router.put('/bank_details/:id',signUp.menu_bank_details)
router.put('/updaterestaurant/:id',upload.fields([ {
    name: 'shop_image_front', maxCount: 1
}, {
    name: 'restaurant_logo', maxCount: 1
}]), signUp.updateResturantDetails)
router.post('/login_vendor',signUp.logIn)
router.delete('/deleteretaurant/:id', signUp.deleteRetaurant)
router.post('/forgotpassword', signUp.forgotpassword)
router.get('/logout',signUp.logout)
router.get('/vendor_completed_order',authorization_restro,signUp. vendor_completed_order)
router.get('/vendor_cancelled_order',authorization_restro,signUp. vendor_cancelled_order)
router.get('/vendor_order_listing',authorization_restro,signUp. vendor_order_listing)
router.get('/vendor_report_bydate',authorization_restro,signUp. vendor_report_bydate)
router.get('/vendor_report_bymonth',authorization_restro,signUp. vendor_report_bymonth)
router.get('/vendor_report_betweendates',authorization_restro,signUp. vendor_report_betweendates)
router.delete('/vendor_order_delete/:id',authorization_restro,signUp.vendor_order_delete)

router.put('/changepassword/:id', signUp.changePassword)
// router.put('/searnearby/:id', signUp.searnearby)



// Products



router.post('/create_menu/',upload.single("image"),authorization_restro,menu.create_menu);
router.post('/search_product',authorization_restro,menu.search_product)
router.post('/create_combo',upload.single("image"),authorization_restro,menu.create_combos);
router.delete('/delete_comboitem/:id',authorization_restro,menu.delete_combo_item);
router.delete('/delete_combo/:id',authorization_restro,menu.delete_combo);
router.get('/get_combo/:id',authorization_restro,menu.getall_combo);


router.get('/get_products/:id',menu.getall_products);
router.get('/get_productsdetails/:id',menu.get_productsdetails);
router.post('/get_productsbysubcategory/:id',menu.get_productsbysubcategory);
router.delete('/delete_product/:id',menu.delete_product);
router.patch('/edit_product/:id',upload.single("image"),menu.edit_product);



// payment\
router.post('/AddCard_stripe',authorization_user,payment.AddCard);
// router.post('/webhook',commonservices.apiAuthAuthenticated,payment.webhook);
//  router.get('/earning',commonservices.apiAuthAuthenticated,payment.earning);
router.post('/addbank',authorization_user,payment.addBank);
router.get('/ListCard',authorization_user,payment.ListCard);
// router.post('/payout',commonservices.apiAuthAuthenticated,payment.payout);
router.post('/Default_card',authorization_user,payment.Default_card);
router.post('/Login_stripe',authorization_restro,payment.Login_stripe);
// router.post('/order_payment',commonservices.apiAuthAuthenticated,payment.order_payment);







module.exports = router