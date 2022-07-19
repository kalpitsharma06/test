const express = require('express')
const router = express.Router()
const addUser = require('../controller/userController')
const { auth } = require('../../services/auth');

router.post('/adduser',addUser.addUser)
router.put('/updateuser/:id',addUser.updateUser)
router.delete('/deleteuser/:id', addUser.deleteUser)
router.get('/login',addUser.logIn)
router.put('/changepassword/:id', addUser.changePassword)

module.exports = router