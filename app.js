require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.port
const cookieParser = require('cookie-parser')
const swaggerUI = require("swagger-ui-express");
const fileUpload = require("express-fileupload");
const cors = require("cors")
var compression = require('compression')
    // const cluster = require("cluster");
    // const totalCPUs = require("os").cpus().length;

const YAML = require("yamljs");
const swaggerJSDocs = YAML.load("./collection.yml");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression())
app.use(cookieParser());
app.use(cors());
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    

const Router = require('./apis/router/index')
const adminRouter = require('./admin/router/index')


app.use('/justeat', Router)
app.use('/admin', adminRouter)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));




// if (cluster.isMaster) {
//     for (let i = 0; i < totalCPUs; i++) {
//         cluster.fork();
//     }

//     cluster.on("exit", (worker, code, signal) => {
//         cluster.fork();
//     });
    
// } else {
//     app.listen(port, () => {
//         console.log(`App listening on port ${port} with pid ${process.pid}`);
//     });
// }













app.listen(port,()=>{
    console.log(`Server is listining on port : ${port}`)
})



