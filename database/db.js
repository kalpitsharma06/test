const mongoose = require('mongoose')
const uri = 'mongodb+srv://madhavappic:9828320124@cluster0.okan6.mongodb.net/juseat'

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
