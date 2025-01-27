const mongoose = require('mongoose');
const { Schema, model } = mongoose;
//schama for user
const newSchema = new Schema({
  name: {
    type: String,
    maxlength: 50
  },
  password: {
    type: String,

  },
  email: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role:{
    type: String,
    enum:['user','admin'],
    default:'user'

  },
  mobileNo: {
    type: String,
  },
  googleId: { 
    type: String,
    default:null
  },
  status: {
    type: String,
    default: 'unblock',
    enum: ['unblock', 'block'],
  },
  email_verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true }); 

const User = model("User", newSchema);

module.exports = User;
