const express = require('express')
const router = express.Router()
const category_type = require('../../admin/controller/category')
const signUp = require('../controller/signup')
const multer = require('multer');
const path = require('path')
const path1 = path.join(__dirname + '../../../public/uploads')
console.log(path1)
const { auth } = require('../../services/auth');
const chalk = require('chalk')

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

router.put('/updaterestaurent/:id', upload.fields(multerArray),signUp.updateResturentDetails)
router.delete('/deleteretaurant/:id', signUp.deleteRetaurant)
router.get('/login',signUp.logIn)
router.put('/changepassword/:id', signUp.changePassword)

router.post('/addcategory', upload.single('image'), category_type.addCategory)
router.get('/getcategorydetails', category_type.getCategoryDetails)
router.delete('/deletecategory/:id', category_type.deleteCategory)
router.put('/updatecategory/:id', upload.single('image'), category_type.updateCategory)

router.post('/addsubcategory', upload.single('image'), category_type.subCategory)
router.get('/getsubcategorydetails', category_type.getSubCategoryDetails)
router.delete('/deletesubcategory/:id', category_type.deleteSubCategory)
router.put('/updatesubcategory/:id', upload.single('image'), category_type.updateSubCategory)


module.exports = router