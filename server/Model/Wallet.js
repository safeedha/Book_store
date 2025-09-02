const mongoose = require('mongoose');
const { Schema } = mongoose;

const WalletSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wallet_item: [
      {
        transactionType: {
          type: String,
          enum: ['debit', 'credit'],
          required: true,
        },
        date: { type: Date, default: Date.now },
        amount: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Wallet = mongoose.model('Wallet', WalletSchema);
module.exports = Wallet;
