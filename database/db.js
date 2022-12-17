const mongoose = require('mongoose')
//const uri = 'mongodb://127.0.0.1:27017/justeat'
 const uri = 'mongodb+srv://kalpit007:KvkFwl1kNB9bgedB@cluster0.rrksv0d.mongodb.net/justeat'

let con = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
},
    (error) => {
        if (error) {
            console.log("Error!" + error);
        } else {
            console.log("Successfully connected")
        }
    })

module.exports = { con }


