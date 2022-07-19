require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const vendorRouter = require('./vendor/router/index')
const adminRouter = require('./admin/router/index')
const userRouter = require('./user/router/index')

app.use('/vendor', vendorRouter)
app.use('/admin', adminRouter)
app.use('/user', userRouter)

app.listen(port,()=>{
    console.log(`Server is listining on port : ${port}`)
})



