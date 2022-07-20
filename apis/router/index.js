const express = require('express')
const router = express.Router()
const addUser = require('../controller/userController')
const { auth } = require('../../services/auth');
const signUp = require('../controller/signup')
const menu = require('../controller/menucontroller')
const multer = require('multer');
const path = require('path')
const path1 = path.join(__dirname + '../../../public/uploads')




const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path1);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
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
    name: 'menu', maxCount: 1
}, {
    name: 'restaurant_logo', maxCount: 1
}]
// usercontroller

router.post('/adduser',addUser.addUser)
router.put('/updateuser/:id',addUser.updateUser)
router.delete('/deleteuser/:id', addUser.deleteUser)
router.get('/login',addUser.logIn)
router.put('/changepassword/:id', addUser.changePassword)
router.get('/search/:key', addUser.Search)




// vendor controller


router.post('/addrestaurent',
    upload.fields([{
        name: 'photo_id', maxCount: 1
    }, {
        name: 'proof_of_ownership', maxCount: 1
    }, {
        name: 'shop_image_front', maxCount: 1
    }, {
        name: 'foot_hygiene_registration', maxCount: 1
    }, {
        name: 'menu', maxCount: 1
    }, {
        name: 'restaurant_logo', maxCount: 1
    }]),
    signUp.addResturent)

   

router.put('/updaterestaurent/:id', upload.single("image"),signUp.updateResturentDetails)
router.delete('/deleteretaurant/:id', signUp.deleteRetaurant)
router.get('/login',signUp.logIn)
router.put('/changepassword/:id', signUp.changePassword)




// Products


router.post('/create_menu/:id',upload.single('image'),menu.create_menu);






module.exports = router