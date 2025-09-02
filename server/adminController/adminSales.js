const Order = require('../Model/Order');

const todayreport = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    const orders = await Order.aggregate([
      {
        $match: {
          'order_item.delivered_date': {
            $gte: new Date(start),
            $lte: new Date(end),
          },
        },
      },
      {
        $project: {
          user_id: 1,
          shipping_address: 1,
          payment_methods: 1,
          total_amount: 1,
          actual_amount: 1,
          coupen_id: 1,
          order_items: {
            $filter: {
              input: '$order_item',
              as: 'item',
              cond: {
                $and: [
                  { $gte: ['$$item.delivered_date', new Date(start)] },
                  { $lte: ['$$item.delivered_date', new Date(end)] },
                ],
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
      {
        $lookup: {
          from: 'coupens',
          localField: 'coupen_id',
          foreignField: '_id',
          as: 'coupen_details',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_details',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'order_items.product_id',
          foreignField: '_id',
          as: 'product_details',
        },
      },
    ]);

    res.status(200).json({ order: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  todayreport,
};
