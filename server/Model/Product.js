const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    trim: true, 
  },
  description: {
    type: String,
    required: [true, "Product description is required."],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Product author is required."],
  },
  language: {
    type: String,
    required: [true, "Product language is required."],
  },
  price: {
    type: Number,
    required: [true, "Product price is required."],
    min: [0, "Price cannot be negative."],
  },
  sellingcount:{
    type:Number,
    default:0
   },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: [true, "Product category is required."],
  },
  stock: {
    type: Number,
    default: 0, 
    min: [0, "Stock cannot be negative."],
  },
  images: {
    type: [String],
    required: [true, "Product images are required."],
    validate: {
      validator: function (v) {
        return v.length >= 3; 
      },
      message: "Product must have at least 3 images.",
    },
  },
  sku: { 
    type: String,  
    unique: true,
    required: [true, "Product SKU is required."],
    trim: true, 
  },
  status: {
    type: String,
    enum: ['unblock', 'block'], 
    default: 'unblock', 
  },
  stockStatus: {
    type: String,
    enum: ['available', 'out of stock'], 
    default: 'available', 
  },
  offerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    default:null
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = model('Product', productSchema);
module.exports = Product;
