const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const coupenSchema = new Schema(
  {
    coupenCode: {
      type: String,
      required: true,
    },
    coupenType: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },
    minimumPurchase: {
      type: Number,
      required: true,
    },
    discountedAmount: {
      type: Number,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'active',
    },
    userId: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Coupen = model('Coupen', coupenSchema); // Removed the extra '='
module.exports = Coupen;
