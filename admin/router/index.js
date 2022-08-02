const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path')
const { auth,authorization, authorization_admin } = require('../../services/auth');
const path1 = path.join(__dirname + '../../../public/uploads')

const category_type = require('../../admin/controller/category')
const signUp = require('../controller/login')
const vendor = require('../controller/vendorcontroller')
const user = require('../controller/usercontroller')

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


// Admin login
router.get('/logout',authorization_admin, signUp.logout);
router.post('/signup', signUp.admindetails);
router.put('/change_password',authorization_admin,signUp.change_Password);
router.post('/logIn', signUp.logIn);

// Vendor control
router.get('/getrestaurants',vendor.get_restaurants)

router.post('/create_vendor',
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
    }]), vendor.create_vendor);

router.put('/edit_vendor/:id',
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
    }]), vendor.edit_vendor);
router.delete('/delete_vendor/:id', vendor.delete_vendor);

// Category control
router.post('/addcategory', upload.single('image'), category_type.addCategory)
router.get('/getcategorydetails', category_type.getCategoryDetails)
router.delete('/deletecategory/:id', category_type.deleteCategory)
router.put('/updatecategory/:id', upload.single('image'), category_type.updateCategory)

// Sub-Category control
router.post('/addsubcategory', upload.single('image'), category_type.subCategory)
router.get('/getsubcategorydetails', category_type.getSubCategoryDetails)
router.delete('/deletesubcategory/:id', category_type.deleteSubCategory)
router.put('/updatesubcategory/:id', upload.single('image'), category_type.updateSubCategory)

// User control
router.post('/adduser',user.addUser)
router.put('/updateuser/:id',user.updateUser)
router.delete('/deleteuser/:id', user.deleteUser)
router.get('/getusers',user.get_users)

module.exports = router