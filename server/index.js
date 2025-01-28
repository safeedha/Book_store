const express = require('express');
const cors = require('cors');
const user_routes = require('./Router/userRouter.js')
const admin_routes = require('./Router/adminRouter.js');
const cookieParser = require('cookie-parser');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config()

const port=process.env.PORT||8000
const razorpay = new Razorpay({
  key_id: process.env.KEYID,
  key_secret:process.env.KEYSECRET
})



const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/BookLoom')
  .then(() => console.log('Connected!'))

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true, 
}));

app.use(express.json());
app.use(cookieParser())



app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount,
      currency: 'INR',
      receipt: 'receipt_' + Math.random().toString(36).substring(7),
    }
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

app.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', 'toMYZYyUM0mObogBqYDzRIcU')
                            .update(sign.toString())
                            .digest('hex');
     console.log(razorpay_signature,expectedSign)
    if (razorpay_signature === expectedSign) {
     
      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid payment signature' });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
});





app.use('/user', user_routes);  
app.use('/admin', admin_routes); 


app.listen(port, () => {
  console.log(`Server is running on port 8000.`);
});