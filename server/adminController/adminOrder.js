const Order = require('../Model/Order');
const Product = require('../Model/Product');
const Wallet = require('../Model/Wallet');
const Category = require('../Model/Category');

const getOrder = async (req, res, next) => {
  try {
    let { currentPage = 1, rowsPerPage  } = req.query;
    currentPage = parseInt(currentPage);
    rowsPerPage = parseInt(rowsPerPage);


    const totalOrders = await Order.countDocuments();


    const orders = await Order.find({})
      .populate('user_id')
      .populate('shipping_address')
      .populate({ path: 'order_item.product_id', select: 'name images' })
      .sort({ updatedAt: -1 })
      .skip((currentPage - 1) * rowsPerPage)
      .limit(rowsPerPage);

    res.status(200).json({
      success: true,
      orders,
      totalPages: Math.ceil(totalOrders / rowsPerPage),
    });
  } catch (error) {
    next(error);
  }
};


const OrderStatus = async (req, res, next) => {
  try {
    const { orderId, prodId } = req.params;

    const { newStatus } = req.body;

    const order = await Order.findOne({ _id: orderId }).populate('coupen_id');
    const product = await Product.findById(prodId);
    let catId = product.categoryId;
    const id = order.user_id;
    const orderItem = order.order_item.find(
      (item) => item.product_id.toString() === prodId
    );
    const quantityToAdjust = orderItem ? orderItem.quantity : 0;

    const result = await Order.updateOne(
      { _id: orderId, 'order_item.product_id': prodId },
      {
        $set: {
          'order_item.$.order_status': newStatus,
        },
      }
    );

    if (newStatus === 'Delivered') {
      const paymentStatus =
        order.payment_methods === 'cash on delivery' ? 'paid' : 'paid';

      await Order.updateOne(
        { _id: orderId, 'order_item.product_id': prodId },
        {
          $set: {
            'order_item.$.payment_status': paymentStatus,
            'order_item.$.delivered_date': new Date(),
          },
        }
      );
    }

    let wallet = await Wallet.findOne({ user_id: id });
    if (!wallet) {
      wallet = await Wallet.create({
        user_id: id,
      });
    }
    const walletarray = wallet.wallet_item;

    if (newStatus === 'Cancelled') {
      if (
        order.payment_methods === 'online payment' ||
        (order.payment_methods === 'wallet payment' && order.coupen_id)
      ) {
        if (order.total_amount < order.actual_amount) {
          let updatedOrderItems = order.order_item.filter(
            (item) =>
              item.product_id.toString() !== prodId &&
              item.order_status !== 'Cancelled' &&
              item.order_status !== 'returned'
          );
          let sumofremaining = updatedOrderItems.reduce(
            (accum, current) =>
              Math.ceil(
                (current.original_price -
                  (current.original_price * discount) / 100) *
                  current.quantity
              ) + accum,
            0
          );
          if (sumofremaining >= order.coupen_id.minimumPurchase) {
            order.actual_amount = sumofremaining;
            if (order.coupen_id.coupenType === 'flat') {
              order.total_amount =
                sumofremaining - order.coupen_id.discountedAmount;
            }
            if (order.coupen_id.coupenType === 'discount') {
              order.total_amount = Math.ceil(
                sumofremaining -
                  Math.ceil(
                    (sumofremaining * order.coupen_id.discountedAmount) / 100
                  )
              );
            }
            amount = Math.ceil(
              (orderItem.original_price -
                Math.ceil(
                  (orderItem.original_price * orderItem.discount) / 100
                )) *
                orderItem.quantity
            );
            walletarray.unshift({ transactionType: 'cancel', amount: amount });
            await wallet.save();
            await order.save();
          } else {
            let amount =
              Math.ceil(
                orderItem.original_price -
                  (orderItem.original_price * orderItem.discount) / 100
              ) * orderItem.quantity;

            if (!order.remaining) {
              order.remaining = 0;
            }
            let remaining = order.remaining;
            if (order.coupen_id.coupenType === 'flat') {
              if (remaining && amount >= remaining) {
                let value = amount - remaining;
                walletarray.unshift({
                  transactionType: 'credit',
                  amount: value,
                });
                order.coupen_id = null;
                order.remaining = 0;
                await wallet.save();
              }

              if (amount > order.coupen_id.discountedAmount) {
                let value = amount - order.coupen_id.discountedAmount;
                order.coupen_id = null;
                walletarray.unshift({
                  transactionType: 'credit',
                  amount: value,
                });
                await wallet.save();
                await order.save();
              }

              if (amount < order.coupen_id.discountedAmount) {
                let value = Math.abs(amount - order.coupen_id.discountedAmount);
                order.remaining = value;
              }

              order.actual_amount = sumofremaining;
              order.total_amount = sumofremaining;
              await order.save();
            } else {
              let discount = order.actual_amount - order.total_amount;

              if (!order.remaining) {
                order.remaining = 0;
              }
              let remaining = order.remaining;
              if (remaining && amount >= remaining) {
                let value = amount - remaining;
                walletarray.unshift({
                  transactionType: 'credit',
                  amount: value,
                });
                order.coupen_id = null;
                order.remaining = 0;
                await wallet.save();
              }

              if (amount > discount) {
                let value = amount - order.coupen_id.discountedAmount;
                walletarray.unshift({
                  transactionType: 'credit',
                  amount: value,
                });
                order.remaining = 0;
                order.coupen_id = null;
                await wallet.save();
              }

              if (amount < discount) {
                let value = Math.abs(amount - discount);
                order.remaining = value;
              }

              order.actual_amount = sumofremaining;
              order.total_amount = sumofremaining;
              await order.save();
            }
          }
        }
      }
    }

    if (newStatus === 'Cancelled') {
      if (
        order.payment_methods === 'online payment' ||
        (order.payment_methods === 'wallet payment' && !order.coupen_id)
      ) {
        if (order.total_amount === order.actual_amount) {
          let amount =
            Math.ceil(
              orderItem.original_price -
                (orderItem.original_price * orderItem.discount) / 100
            ) * orderItem.quantity;
          let newprice = order.total_amount - amount;
          await Order.updateOne(
            { _id: orderId, 'order_item.product_id': prodId },
            {
              $set: {
                'order_item.$.payment_status': 'refund',
                total_amount: newprice,
                actual_amount: newprice,
              },
            }
          );
          walletarray.unshift({ transactionType: 'credit', amount: amount });
          await wallet.save();
        }
      }
    }

    if (newStatus === 'Cancelled') {
      if (order.payment_methods === 'cash on delivery' && order.coupen_id) {
        let updatedOrderItems = order.order_item.filter(
          (item) =>
            item.product_id.toString() !== prodId &&
            item.order_status !== 'Cancelled' &&
            item.order_status !== 'Returned'
        );
        let sumofremaining = updatedOrderItems.reduce(
          (accum, current) =>
            Math.ceil(
              current.original_price - (current.original_price * discount) / 100
            ) *
              current.quantity +
            accum,
          0
        );
        if (sumofremaining >= order.coupen_id.minimumPurchase) {
          order.actual_amount = sumofremaining;
          if (order.coupen_id.coupenType === 'flat') {
            order.total_amount =
              sumofremaining - order.coupen_id.discountedAmount;
          }
          if (order.coupen_id.coupenType === 'discount') {
            order.total_amount = Math.ceil(
              sumofremaining -
                (sumofremaining * order.coupen_id.discountedAmount) / 100
            );
          }

          await order.save();
        } else {
          order.actual_amount = sumofremaining;
          order.total_amount = sumofremaining;
          order.coupen_id = null;
          await order.save();
        }
      }
    }

    if (newStatus === 'Cancelled') {
      if (order.payment_methods === 'cash on delivery' && !order.coupen_id) {
        let amount =
          Math.ceil(
            orderItem.original_price -
              (orderItem.original_price * orderItem.discount) / 100
          ) * orderItem.quantity;
        let newprice = order.total_amount - amount;
        await Order.updateOne(
          { _id: orderId, 'order_item.product_id': prodId },
          {
            $set: {
              total_amount: newprice,
              actual_amount: newprice,
            },
          }
        );
      }
    }

    if (newStatus === 'Delivered') {
      const p = await Product.updateOne(
        { _id: prodId },
        { $inc: { sellingcount: orderItem.quantity } }
      );

      await Category.updateOne(
        { _id: catId },
        { $inc: { sellingcount: orderItem.quantity } }
      );
    }

    if (newStatus === 'Cancelled') {
      const newStock = product.stock + quantityToAdjust;
      await Product.updateOne(
        { _id: prodId },
        { $set: { stock: newStock, stockStatus: 'available' } }
      );
    }

    if (newStatus === 'Cancelled') {
      if (order.payment_methods === 'online payment' && order.coupen_id) {
        const hasPendingOrFailed = order.order_item.some(
          (item) =>
            item.payment_status === 'pending' ||
            item.payment_status === 'failed'
        );
        if (hasPendingOrFailed) {
          let updatedOrderItems = order.order_item.filter(
            (item) =>
              item.product_id.toString() !== prodId &&
              item.order_status !== 'Cancelled'
          );
          let sumofremaining = updatedOrderItems.reduce(
            (accum, current) =>
              Math.ceil(
                current.original_price -
                  (current.original_price * discount) / 100
              ) *
                current.quantity +
              accum,
            0
          );
          if (sumofremaining >= order.coupen_id.minimumPurchase) {
            order.actual_amount = sumofremaining;
            if (order.coupen_id.coupenType === 'flat') {
              order.total_amount =
                sumofremaining - order.coupen_id.discountedAmount;
            }
            if (order.coupen_id.coupenType === 'discount') {
              order.total_amount = Math.ceil(
                sumofremaining -
                  (sumofremaining * order.coupen_id.discountedAmount) / 100
              );
            }
            amount =
              Math.ceil(
                orderItem.original_price -
                  (orderItem.original_price * orderItem.discount) / 100
              ) * orderItem.quantity;
            await order.save();
          } else {
            let amount =
              Math.ceil(
                orderItem.original_price -
                  (orderItem.original_price * orderItem.discount) / 100
              ) * orderItem.quantity;

            if (!order.remaining) {
              order.remaining = 0;
            }
            let remaining = order.remaining;
            if (order.coupen_id.coupenType === 'flat') {
              if (remaining && amount >= remaining) {
                let value = amount - remaining;
                order.coupen_id = null;
                order.remaining = 0;
              }

              if (amount > order.coupen_id.discountedAmount) {
                let value = amount - order.coupen_id.discountedAmount;
                order.coupen_id = null;
                await order.save();
              }

              if (amount < order.coupen_id.discountedAmount) {
                let value = Math.abs(amount - order.coupen_id.discountedAmount);
                order.remaining = value;
              }

              order.actual_amount = sumofremaining;
              order.total_amount = sumofremaining;
              await order.save();
            } else {
              let discount = order.actual_amount - order.total_amount;

              if (!order.remaining) {
                order.remaining = 0;
              }
              let remaining = order.remaining;
              if (remaining && amount >= remaining) {
                let value = amount - remaining;
                order.coupen_id = null;
                order.remaining = 0;
              }

              if (amount > discount) {
                let value = amount - order.coupen_id.discountedAmount;
                order.remaining = 0;
                order.coupen_id = null;
              }

              if (amount < discount) {
                let value = Math.abs(amount - discount);
                order.remaining = value;
              }

              order.actual_amount = sumofremaining;
              order.total_amount = sumofremaining;
              await order.save();
            }
          }
        }
      }
    }

    if (newStatus === 'Cancelled') {
      if (order.payment_methods === 'online payment' && !order.coupen_id) {
        amount =
          Math.ceil(
            orderItem.original_price -
              (orderItem.original_price * orderItem.discount) / 100
          ) * orderItem.quantity;
        let newprice = order.total_amount - amount;
        const hasPendingOrFailed = order.order_item.some(
          (item) =>
            item.payment_status === 'pending' ||
            item.payment_status === 'failed'
        );
        if (hasPendingOrFailed) {
          const result = await Order.updateOne(
            { _id: orderId, 'order_item.product_id': prodId },
            {
              $set: {
                'order_item.$.payment_status': 'unpaid',
                total_amount: newprice,
                actual_amount: newprice,
              },
            }
          );
        }
      }
    }

    const newOrder = await Order.find({})
      .populate('user_id')
      .populate('shipping_address')
      .populate({ path: 'order_item.product_id', select: 'name images' })
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, order: newOrder });
  } catch (error) {
    next(error);
  }
};

const singleOrderdetail = async (req, res, next) => {
  try {
    const { orderid, prodId } = req.params;

    const order = await Order.findById(orderid)
      .populate({
        path: 'order_item.product_id',
        select: 'name images ',
      })
      .populate('shipping_address');

    const date = new Date(order.createdAt);
    const formattedDate = date.toISOString().split('T')[0];

    const productDetails = order.order_item.find(
      (item) => item.product_id._id.toString() === prodId
    );
    const response = {
      date: formattedDate,
      productname: productDetails.product_id.name,
      image: productDetails.product_id.images[0],
      quantity: productDetails.quantity,
      TotalPrice:
        Math.ceil(
          productDetails.original_price -
            (productDetails.original_price * productDetails.discount) / 100
        ) * productDetails.quantity,
      OrderStatus: productDetails.order_status,
      PaymentMethod: order.payment_methods,
      paymentStatus: productDetails.payment_status,
      shippingname: order.shipping_address.name,
      shippingnumber: order.shipping_address.phone,
      shippingstreetAddress: order.shipping_address.streetAddress,
      shippingstate: order.shipping_address.state,
      shippingdistrict: order.shipping_address.district,
      shippingcity: order.shipping_address.city,
      shippingpincode: order.shipping_address.pincode,
    };
    return res.status(200).json({
      message: 'Order details retrieved successfully',
      order: response,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrder,
  OrderStatus,
  singleOrderdetail,
};
