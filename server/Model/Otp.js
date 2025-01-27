const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema({
  otp: {
    type: String
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

schema.index({ createdAt: 1 }, { expireAfterSeconds: 180 });


const OtpModel = model('Otp', schema);

module.exports = OtpModel;

