const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  status: {
    type: String,
    enum: ['unblock', 'block'],
    default: 'unblock',
  },
  sellingcount:{
    type:Number,
    default:0
   },
   offerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
      default:null
    },
});

const CategoryModel = model('Category', schema);

module.exports = CategoryModel;
