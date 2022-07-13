require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const signUp = require('./router/signup')



app.use('/justeat', signUp)


app.listen(port,()=>{
    console.log(`Server is listining on port : ${port}`)
})



