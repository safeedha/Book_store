const mongoose = require('mongoose');
const { Schema } = mongoose;


const OrderSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    shipping_address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address', 
      required: true,
    },
    payment_methods: {
      type: String,
      required: true,
      enum: ['cash on delivery', 'online payment','wallet payment'],
    },
    total_amount: {
      type: Number,
      required: true,
    },

    actual_amount:{
      type:Number,
      required:true
    },
    shippingCharge:{
      type:Number,
      default:50
    },
    coupen_id:{ 
          type: mongoose.Schema.Types.ObjectId,
           ref: 'Coupen',
           default:null,
          },
    remaining:{
      type:Number,
      required:false,
    },
    order_item: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Reference to Product model
        quantity: { type: Number, required: true },
        original_price: { type: Number, required: true },
        discount:{ type: Number, default:null},
        payment_status: {
          type: String,
          required: true,
          enum: ['paid', 'unpaid', 'failed','refund','pending'],
          default: 'unpaid',
        },
        order_status: {
          type: String,
          default: 'Pending',
          enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled','Returned'],
        },
        delivered_date:{
         type:Date
        },
        return_request:{
          is_requested:{type:Boolean,default:false},
          return_reason:{type:String},
          is_approved:{type:Boolean}
        }
      },
    ],
    
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', OrderSchema);
