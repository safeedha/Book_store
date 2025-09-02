const express = require('express');
const admin_routes = express.Router();
const account = require('../adminController/adminLogin');
const { verifyUser } = require('../Middleware/tokenverify');
const customer = require('../adminController/adminCustomer');
const category = require('../adminController/adminCategory');
const product = require('../adminController/adminProduct');
const order = require('../adminController/adminOrder');
const { errorHandler } = require('../Middleware/errorHandle');
const coupen = require('../adminController/CoupenManagement');
const offer = require('../adminController/offercontroll');
const returned = require('../adminController/returnHandle');
const sales = require('../adminController/salesHandle');
const trend = require('../adminController/trendingHandle');
const sale = require('../adminController/adminSales');

admin_routes.post('/login', account.adminLogin);
admin_routes.get('/customer', verifyUser, customer.getCustomer);
// admin_routes.get('/customer/page', verifyUser, customer.getPage);
admin_routes.get('/customer/:id', verifyUser, customer.getsingleUser);
admin_routes.post('/customer/:id', verifyUser, customer.editChanges);
admin_routes.patch('/customer/:id', verifyUser, customer.statusUpdate);

admin_routes.post('/category', verifyUser, category.addCategory);
admin_routes.get('/category', verifyUser, category.getCategory);
admin_routes.patch('/category/:id', verifyUser, category.statusUpdate);
admin_routes.get('/category/:id', verifyUser, category.getsingleCategory);
admin_routes.post('/category/:id', verifyUser, category.updateCategory);

admin_routes.post('/product', verifyUser, product.addProduct);
admin_routes.get('/product', verifyUser, product.getProduct);
admin_routes.patch('/product/:id', verifyUser, product.statusUpdate);
admin_routes.get('/product/:id', verifyUser, product.getsingleProduct);
admin_routes.post('/product/:id', verifyUser, product.updateProduct);

admin_routes.get('/order', verifyUser, order.getOrder);
admin_routes.patch('/order/:orderid', verifyUser, order.OrderStatus);
admin_routes.get(
  '/order/:orderid/product/:prodId',
  verifyUser,
  order.singleOrderdetail
);
admin_routes.patch('/order/:orderId/:prodId', verifyUser, order.OrderStatus);

admin_routes.post('/coupen', verifyUser, coupen.createCoupen);
admin_routes.get('/coupen', verifyUser, coupen.getAllCopen);
admin_routes.patch('/coupen/:id', verifyUser, coupen.deletCoupen);

admin_routes.post('/offer/category', verifyUser, offer.createcategoryOffer);
admin_routes.post('/offer/product', verifyUser, offer.createproductOffer);
admin_routes.get('/offer', verifyUser, offer.getActiveoffer);
admin_routes.delete('/offer/:offerid', verifyUser, offer.deleteOffer);

admin_routes.get('/return', verifyUser, returned.getAllreturnedProduct);
admin_routes.patch('/return/approve', verifyUser, returned.getApprove);
admin_routes.patch('/return/reject', verifyUser, returned.getReject);

admin_routes.get('/sales/today', verifyUser, sales.todayreportHandle);
admin_routes.get('/sales/week', verifyUser, sales.weekreportHandle);
admin_routes.get('/sales/month', verifyUser, sales.monthReportHandle);
admin_routes.get('/sales/custom', verifyUser, sales.customReportHandle);

admin_routes.get('/topproduct', verifyUser, trend.getTopProduct);
admin_routes.get('/topcategory', verifyUser, trend.getTopCategory);

admin_routes.get('/today', verifyUser, sale.todayreport);

admin_routes.use(errorHandler);
module.exports = admin_routes;
