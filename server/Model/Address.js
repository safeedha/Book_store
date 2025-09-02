const mongoose = require('mongoose'); // Corrected typo in 'moongose' to 'mongoose'
const { Schema, model } = mongoose;
const User = require('./User');

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      // Corrected typo in 'distric' to 'district'
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    status: {
      type: String,
      default: 'unblock',
      enum: ['block', 'unblock'],
    },
  },
  {
    timestamps: true, // Moved into the schema options object
  }
);

const AddressModel = model('Address', schema);
module.exports = AddressModel;
