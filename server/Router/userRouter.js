const express = require('express');
const { verifyUsertoken } = require('../Middleware/usertokenverify');
const user_routes = express.Router();
const account = require('../usercontroller/account');
const landing = require('../usercontroller/Landing');
const profile = require('../usercontroller/profile');
const address = require('../usercontroller/Addressmanage');
const cart = require('../usercontroller/cartManagement');
const order = require('../usercontroller/OrderManagement');
const password = require('../usercontroller/Passwordreset');
const { errorHandler } = require('../Middleware/errorHandle');
const wish = require('../usercontroller/Wishlistmanage');
const coupen = require('../usercontroller/coupenHandle');
const retoorn = require('../usercontroller/returnHandle');
const wallet = require('../usercontroller/walletHandle');

user_routes.post('/signup', account.userSignup);
user_routes.post('/otpverification', account.otpVerification);
user_routes.post('/resend', account.otpResend);
user_routes.post('/google-login', account.googleLogin);
user_routes.post('/login', account.userLogin);

user_routes.post('/forgetpassword', password.forgetPassword);
user_routes.post('/resetpassword', password.Passwordreset);

user_routes.get('/product/newarrival', landing.newArrival);
user_routes.get('/product', landing.getAllProduct);
user_routes.get('/product/:id', landing.getsingleProduct);
user_routes.get('/related-products', landing.getRelatedProducts);
user_routes.get('/category', landing.getAllCategory);
user_routes.get('/status', verifyUsertoken, landing.userVerify);

user_routes.post('/profile/update', profile.updateProfile);
user_routes.patch('/profile/update/:id', profile.chanePassword);

user_routes.post('/address', verifyUsertoken, address.addAddress);
user_routes.get('/address', verifyUsertoken, address.fetchAddress);
user_routes.get('/address/:id', verifyUsertoken, address.getsingleAddress);
user_routes.post('/address/:id', verifyUsertoken, address.updateAddress);
user_routes.delete('/address/:add_id', verifyUsertoken, address.deleteAddress);

user_routes.post('/cart', verifyUsertoken, cart.addtoCart);
user_routes.get('/cart', verifyUsertoken, cart.getCartProduct);
user_routes.delete('/cart/:id', verifyUsertoken, cart.deleteCarttItem);
user_routes.get('/cart/quantity', verifyUsertoken, cart.getQuantitCart);
user_routes.post('/cart/add/:cartId', verifyUsertoken, cart.addQuantityCart);
user_routes.post('/cart/sub/:cartId', verifyUsertoken, cart.subQuantityCart);

user_routes.post('/order', verifyUsertoken, order.CreateOrder);
user_routes.get('/order', verifyUsertoken, order.getOrder);
user_routes.patch('/order/:orderid', verifyUsertoken, order.cancelOrder);
user_routes.get(
  '/orders/:orderid/product/:productId',
  verifyUsertoken,
  order.getSingleOrderdetail
);
user_routes.get(
  '/orders/:orderid/:productId',
  verifyUsertoken,
  order.relatedProduct
);
user_routes.post(
  '/return/:orderid/product/:productId',
  verifyUsertoken,
  retoorn.returnProduct
);
user_routes.patch('/payment', verifyUsertoken, order.paymentStatus);

user_routes.post('/wishlist/add', verifyUsertoken, wish.addToWishlist);
user_routes.post('/wishlist/remove', verifyUsertoken, wish.removeFromWishlist);
user_routes.get(
  '/wishlist/:productId',
  verifyUsertoken,
  wish.getWishListstatus
);
user_routes.get('/wishlist', verifyUsertoken, wish.getWishList);

user_routes.get('/coupen/:price', verifyUsertoken, coupen.getAllcoupen);
user_routes.post('/coupen', verifyUsertoken, coupen.applyCoupen);

user_routes.get('/wallet', verifyUsertoken, wallet.getWalletInform);
user_routes.post('/wallet/add', verifyUsertoken, wallet.walletMoneyAdd);

user_routes.use(errorHandler);
module.exports = user_routes;
