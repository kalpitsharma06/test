require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const router = require('./vendor/router/index')

app.use('/justeat', router)

app.listen(port,()=>{
    console.log(`Server is listining on port : ${port}`)
})



