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
      filename: (req, file, cb) => {
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
//     storage:  multerS3({
//         s3: s3,
//         bucket:"justeat",
//         metadata: function (req, file, cb) {
//             cb(null, { fieldName: file.fieldname });
            
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + "-" + file.originalname)
//      }
//     }),
//     limits: {maxsize}
// });

router.get('/logout',authorization_admin, signUp.logout);
router.post('/signup', signUp.admindetails);
router.put('/change_password',authorization_admin,signUp.change_Password);
router.post('/logIn', signUp.logIn);

// Vendor control
router.get('/getrestaurants',vendor.get_restaurants)

router.post('/addrestaurant', vendor.addrestaurant);

router.put('/updateResturantDetails/:id',
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
    }]), vendor.updateResturantDetails);
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