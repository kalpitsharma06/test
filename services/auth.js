const jwt = require('jsonwebtoken');
const registerusersModel = require("../apis/model/signup")
const registerusersModel_admin = require("../admin/model/login")
const registerusersModel_user = require("../apis/model/userModel")



exports.generateAccessToken = (userPayload) => {
    return jwt.sign(userPayload, process.env.TOKEN_SECRET);
}

// exports.auth = (req, res, next) => {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(403)
//     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403)
//     })
//     next()
// }

exports.authorization_restro =(req,res,next)  =>  {

   

    const token = req.cookies.access_token;


    if(!token){
          res.status(200).json({
                status: 401,
                message: "Please Login"
            });
            return;
    }
    else{
        try{
            const verified = jwt.verify(token, 'AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl');
            
            
            
            
            
            req.user = verified;
            
            registerusersModel.find({_id: req.user.id},(err,rows)=>{
                if(rows.length>0){
                    if(rows[0].active != undefined && rows[0].active != null && rows[0].active != ""){
                        if(rows[0].active == true){
                            req.user.email=rows[0].email;
                            next();
                        }
                        else{
                            res.status(401).json({
                                status: 401,
                                message: "You Are Blocked!"
                            });
                            return;
                        }
                    }
                    else{
                        next();
                    }
                }
                else {
                    res.status(401).json({
                        status: 401,
                        message: "Invalid Token"
                    });
                    return;
                }
        });
        }
        catch(err){
            res.status(401).json({
                status: 401,
                message: "Invalid Token"
            });
            return;
        }
    }
}


exports.authorization_user =(req,res,next)  =>  {

   

    const token = req.cookies.access_token;
    // const token = req.header('Authorization');


    if(!token){
          res.status(200).json({
                status: 401,
                message: "Please Login"
            });
            return;
    }
    else{
        try{
            const verified = jwt.verify(token, 'AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl');
            
            
            
            
            
            req.user = verified;
            
            registerusersModel_user.find({_id: req.user.id},(err,rows)=>{
                // console.log(req.user)
                if(rows.length>0){
                    if(rows[0].active != undefined && rows[0].active != null && rows[0].active != ""){
                        if(rows[0].active == true){
                            req.user.email=rows[0].email;
                            next();
                        }
                        else{
                            res.status(401).json({
                                status: 401,
                                message: "You Are Blocked!"
                            });
                            return;
                        }
                    }
                    else{
                        next();
                    }
                }
                else {
                    res.status(401).json({
                        status: 401,
                        message: "Invalid Token"
                    });
                    return;
                }
        });
        }
        catch(err){
            res.status(401).json({
                status: 401,
                message: "Invalid Tokens"
            });
            return;
        }
    }
}


exports.authorization_admin =(req,res,next)  =>  {

   

    const token = req.cookies.access_token;


    if(!token){
          res.status(200).json({
                status: 401,
                message: "Please Login"
            });
            return;
    }
    else{
        try{
            const verified = jwt.verify(token, 'AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl');
            
            
            
            
            
            req.user = verified;
            
            registerusersModel_admin.find({_id: req.user.id},(err,rows)=>{
                if(rows.length>0){
                    if(rows[0].active != undefined && rows[0].active != null && rows[0].active != ""){
                        if(rows[0].active == true){
                            req.user.email=rows[0].email;
                            next();
                        }
                        else{
                            res.status(401).json({
                                status: 401,
                                message: "You Are Blocked!"
                            });
                            return;
                        }
                    }
                    else{
                        next();
                    }
                }
                else {
                    res.status(401).json({
                        status: 401,
                        message: "Invalid Token"
                    });
                    return;
                }
        });
        }
        catch(err){
            res.status(401).json({
                status: 401,
                message: "Invalid Token"
            });
            return;
        }
    }
}



// exports.authorization = (req, res, next) => {
//     const token = req.cookies.access_token;
//     if (!token) {
//         return res.sendStatus(403)
//     }
//     try {
//         next();
//     } catch (err) {
//         return res.status(401).json({
//             status: 401,
//             message: "please login first!"
//         })
// }





















// }


    exports.getSecretToken = () => {

        return 'AcdHz3LjemqvI872qrBpLY4B6SU3h56MexbzQpfWl1I1UgLzghtypLkUkl'
    }
