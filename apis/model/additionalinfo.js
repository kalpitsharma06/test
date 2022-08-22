const mongoose = require('mongoose');
const con = require('../../database/db')

var additional_info = new mongoose.Schema({
     restaurant_id:{ type: mongoose.Types.ObjectId, ref: "signup" },
     restaurant_name: {type:String},
    rating:{type:String},
    total_reviews:Number,
    final_rating:Number,
timmings:[{
        
        monday_open: {
            type: String ,default:"closed",
        },
        monday_close:{
            type: String ,default:"closed",
        },
        tuesday_open: {    type: String ,default:"closed",},
        tuesday_open: {   type: String ,default:"closed",},
        thursday_open: {   type: String ,default:"closed",},
        thursday_close: {   type: String ,default:"closed",},
        friday_open:{   type: String ,default:"closed",},
        friday_close:{ type: String ,default:"closed",},
        saturday_open:{ type: String ,default:"closed",},
        saturday_close:{ type: String ,default:"closed",},
        sunday_open:{ type: String ,default:"closed",},
        sunday_close:{ type: String ,default:"closed",},
    }
],

feedback:[{
    user_id :{ type: mongoose.Types.ObjectId, ref: "usersignup" },
    feedback:{ type: String},
    rating:{type:Number},
    order_id :{ type: mongoose.Types.ObjectId, ref: "order" },

}

]

    
});

module.exports = mongoose.model('additional_info', additional_info);

