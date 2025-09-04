const Order = require('../Model/Order');

const returnProduct = async (req, res, next) => {
  try {
    const { orderid, productId } = req.params;
    const { returnreason } = req.body;
    const { id } = req.user;
    const order = await Order.findById(orderid);
    const orderItem = order.order_item;

    const single = orderItem.find(
      (item) => item.product_id.toString() === productId
    );
    single.return_request.is_requested = true;
    single.return_request.return_reason = returnreason;
    await order.save();

    const orders = await Order.find({ user_id: id })
      .populate({
        path: 'order_item.product_id',
        select: 'name images',
      })
      .populate('shipping_address')
      .populate('coupen_id')
      .sort({ createdAt: -1 });
    res
      .status(200)
      .json({ message: 'You requested for return', order: orders });
  } catch (error) {
     next(error);
  }
};

module.exports = {
  returnProduct,
};
