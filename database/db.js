const mongoose = require('mongoose')
const uri = 'mongodb+srv://yogendranaruka:9672974802@cluster0.kmsvj.mongodb.net/justeat'

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
