const express = require('express')
const router = express.Router()
const multer = require('multer');
const path = require('path')
const { auth } = require('../../services/auth');
const path1 = path.join(__dirname + '../../../public/uploads')
const category_type = require('../../admin/controller/category')

const signUp = require('../controller/login')
const vendor = require('../controller/vendorcontroller')

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

const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403)
    }
    try {
        next();
    } catch(err) {
        return err.message
    }
};

// login
router.get('/logout',authorization, signUp.logout);
router.post('/signup', signUp.admindetails);
router.put('/changepassword/:id',authorization, signUp.changePassword);
router.get('/logIn', signUp.logIn);

// vendorcontrol

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

router.post('/addcategory', upload.single('image'), category_type.addCategory)
router.get('/getcategorydetails', category_type.getCategoryDetails)
router.delete('/deletecategory/:id', category_type.deleteCategory)
router.put('/updatecategory/:id', upload.single('image'), category_type.updateCategory)

router.post('/addsubcategory', upload.single('image'), category_type.subCategory)
router.get('/getsubcategorydetails', category_type.getSubCategoryDetails)
router.delete('/deletesubcategory/:id', category_type.deleteSubCategory)
router.put('/updatesubcategory/:id', upload.single('image'), category_type.updateSubCategory)




module.exports = router