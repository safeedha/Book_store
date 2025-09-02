const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const schema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Cart = model('Cart', schema);
module.exports = Cart;

// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     items: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//         pricePerUnit: {
//           type: Number,
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//           min: 1,
//         },
//         offerPricePerUnit: {
//           type: Number,
//           required: false,
//         },
//         total: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     totalPrice: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//     coupenApplied: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Coupen',
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// cartSchema.pre('save', function (next) {
//   this.totalPrice = this.items.reduce((acc, item) => acc + item.total, 0);
//   next();
// });

// const Cart = mongoose.model('Cart', cartSchema);

// module.exports = Cart;
