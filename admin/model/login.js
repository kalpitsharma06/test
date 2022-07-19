const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let admin = new mongoose.Schema(
  {
    email: { type: String },
    password: { type: String },
  },
);

module.exports = mongoose.model("admin", admin);  