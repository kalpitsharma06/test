const mongoose = require('mongoose')
const uri = 'mongodb://yamyam:yamyam123@localhost:27017/'

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
