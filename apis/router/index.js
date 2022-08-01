const express = require('express')
const router = express.Router()
const addUser = require('../controller/userController')

const signUp = require('../controller/signup')
const menu = require('../controller/menucontroller')
const multer = require('multer');
const path = require('path')
const path1 = path.join(__dirname + '../../../public/uploads')
const { auth,authorization ,apiAuthAuthenticated } = require('../../services/auth');





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
}]
// usercontroller

router.post('/adduser',addUser.addUser)
router.patch('/updateuser/:id',addUser.updateUser)
router.delete('/deleteuser/:id', addUser.deleteUser)
router.post('/login_user',addUser.logIn)
router.get('/logout',addUser.logout)
router.put('/changepassword/:id', addUser.changePassword)
router.get('/search/:key', addUser.Search)




// vendor controller



router.post('/addrestaurant',signUp.addrestaurant)



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
}, ])
,signUp.ownership_verification)
   

router.put('/updaterestaurant/:id', signUp.updateResturantDetails)
router.delete('/deleteretaurant/:id', signUp.deleteRetaurant)
router.get('/login_vendor',signUp.logIn)

router.put('/changepassword/:id', signUp.changePassword)
// router.put('/searnearby/:id', signUp.searnearby)



// Products


router.post('/create_menu/:id',upload.single("image"),menu.create_menu);






module.exports = router