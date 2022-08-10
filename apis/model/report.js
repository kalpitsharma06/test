const mongoose = require('mongoose');
ObjectId = mongoose.Types.ObjectId;
const Schema = mongoose.Schema;
const MODALFUNC = require('./model_functions').functions;
let reports = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    firstname :{
        type : String
    },
    lastname:{
        type : String
    },
    email : {
        type : String
    },
    issue:{
        type : String
    },
    description:{
        type : String
    },
}, {
    timestamps: {
        created_at: MODALFUNC.string_ts,
        updated_at: MODALFUNC.string_ts
    },
},
    {
    versionKey: false,
    timestamps: true
});


module.exports.reports = mongoose.model("reports", reports);
