const express = require('express')
const router = express.Router()
const addUser = require('../controller/userController')

const signUp = require('../controller/signup')
const menu = require('../controller/menucontroller')
const multer = require('multer');
const path = require('path')
const path1 = path.join(__dirname + '../../../public/uploads')
const { auth,   authorization_restro ,apiAuthAuthenticated,authorization_user} = require('../../services/auth');





const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path1);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});


// const upload = multer({
//     storage: storage,
// });






const maxsize= 1024*5

const upload = multer({
    storage: storage,
    limits: {maxsize}
});
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
const upload1 = multer({
    storage: storage,
   
});
// var multiple_uploads = upload1.fields([{ name: 'photo_id'},{ name: 'proof_of_ownership' }])


// usercontroller

router.post('/adduser',addUser.addUser)
router.patch('/updateuser/:id',authorization_user,addUser.updateUser)
router.delete('/deleteuser/:id',authorization_user, addUser.deleteUser)
router.post('/login_user',addUser.logIn)
router.post('/login_user',addUser.logIn)
router.get('/cart',authorization_user,addUser.cart)

router.put('/changepassword/:id',authorization_user, addUser.changePassword)
router.get('/searchbypin/:key', addUser.Searchby_pincode)
router.get('/Searchbymealtimming/:key', addUser.Searchby_mealtimming)
router.get('/getrestro_byid/:id',addUser.getrestro_byid);
router.post('/cart',authorization_user,addUser.cart);
router.get('/cart_list',authorization_user,addUser.cart_list);
router.get('/cart_clear/:id',authorization_user,addUser.clear_cart);
router.post('/create_order',authorization_user,addUser.create_order);
router.get('/orderlisting',authorization_user,addUser.order_listing);





// vendor controller




router.post('/addrestaurant',signUp.addrestaurant)
router.post('/restro_additionalinfo',authorization_restro,signUp.restaurant_additionalinfo)


router.put('/verification/:id'
,upload.fields([{
    name: 'photo_id', maxCount: 1
}, {
    name: 'proof_of_ownership', maxCount: 1
}, {
    name: 'shop_image_front', maxCount: 1
}, {
    name: 'foot_hygiene_registration', maxCount: 1
}, {
    name: 'permission_to_trade', maxCount: 1
}, 
{
    name: 'menu', maxCount: 1
}, {
    name: 'restaurant_logo', maxCount: 1
}])
,signUp.ownership_verification)

router.put('/bank_details/:id',signUp.menu_bank_details)
   

router.put('/updaterestaurant/:id', signUp.updateResturantDetails)
router.delete('/deleteretaurant/:id', signUp.deleteRetaurant)
router.get('/login_vendor',signUp.logIn)
router.get('/logout',signUp.logout)
router.get('/vendor_order_listing',authorization_restro,signUp.vendor_order_listing)

router.put('/changepassword/:id', signUp.changePassword)
// router.put('/searnearby/:id', signUp.searnearby)



// Products



router.post('/create_menu/:id',upload.single("image"),menu.create_menu);
router.post('/create_combo',upload.single("image"),authorization_restro,menu.create_combos);

router.get('/get_products/:id',upload.single("image"),menu.getall_products);
router.get('/delete_product/:id',menu.delete_product);
router.patch('/edit_product/:id',upload.single("image"),menu.edit_product);




module.exports = router