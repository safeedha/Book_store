// const mongoose = require('mongoose');
// const { Schema, model } = mongoose;

// const offerSchema = new Schema(
//   {
//     offerName: {
//       type: String,
//       required: true,
//     },
//     offerType: {
//       type: String,
//       enum: ["Product", "Category"],
//     },
//     offerType_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref:"Category"/"Product"
//     },
//     offerAmount: {
//       type: Number,
//       required: true,
//     },
//     expiryDate: {
//       type: Date,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );



// const Offer = model("Offer", offerSchema);
// module.exports = Offer;


const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const offerSchema = new Schema(
  {
    offerName: {
      type: String,
      required: true,
    },
    offerType: {
      type: String,
      enum: ["Product", "Category"],
      required: true,
    },
    offerType_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "offerType", 
    },
    offerAmount: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Offer = model("Offer", offerSchema);
module.exports = Offer;
