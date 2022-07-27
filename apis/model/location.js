const mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;
let Schema = mongoose.Schema;
let location = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  loc: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [
      Number
    ],
  },
  longitude: { type: String },
  latitude: { type: String },
  user_type: { type: String },
  restro_name:{ type: String },
  restro_address:{ type: String },
  image:{ type: String },
  banner_image:{ type: String },
});

location.index({ loc: "2dsphere" });

module.exports.location = mongoose.model("location", location);
