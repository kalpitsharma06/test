const express = require('express')
const router = express.Router()
const signUp = require('../controller/signup')


router.post('/signup', signUp.addResturent)
router.put('/forgetpassword/:id', signUp.updatePassword)
router.put('/updatedetails/:id', signUp.updateResturentDetails)
router.get('/login', signUp.logIn)

module.exports = router;