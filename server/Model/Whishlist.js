const mongoose = require('mongoose');
const User=require('../Model/User')
const Product=require('../Model/Product');


const newSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:User,
    required:true
  },
  Products:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product,
        required:true},
      addedOn:{
        type:Date,
        default:Date.now
      }
    }
  ]
},{timestamps:true})
const model=mongoose.model('Wishlist',newSchema)
module.exports=model