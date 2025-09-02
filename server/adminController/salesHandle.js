const Order = require('../Model/Order');

const todayreportHandle = async (req, res, next) => {
  try {
    const today = new Date(); // Current date and time
    const startOfDay = new Date(); // Independent new Date object for start of the day
    startOfDay.setHours(0, 0, 0, 0); // Set start of the day (00:00:00)

    const endOfDay = new Date(); // Independent new Date object for end of the day
    endOfDay.setHours(23, 59, 59, 999); // Set end of the day (23:59:59.999)

    const orders = await Order.aggregate([
      {
        $match: {
          'order_item.delivered_date': {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          'order_item.order_status': 'Delivered',
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
          order_item: {
            $filter: {
              input: '$order_item',
              as: 'item',
              cond: {
                $and: [
                  { $gte: ['$$item.delivered_date', startOfDay] },
                  { $lte: ['$$item.delivered_date', endOfDay] },
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
          from: 'Product', // Product collection
          localField: 'order_item.product_id', // Local field in the Order collection
          foreignField: '_id', // Field in the Product collection
          as: 'product_details', // Alias for joined data
        },
      },
      {
        $lookup: {
          from: 'coupens', // Coupen collection
          localField: 'coupen_id', // Field in the Order collection
          foreignField: '_id', // Field in the Coupen collection
          as: 'coupen_details', // Alias for joined data
        },
      },
    ]);

    res.status(200).json({ message: true, orders });
  } catch (error) {
    next(error);
  }
};

const weekreportHandle = async (req, res, next) => {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(today.getDate() + daysToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log('Start of Week:', startOfWeek);
    console.log('End of Week:', endOfWeek);

    const orders = await Order.aggregate([
      {
        $match: {
          'order_item.delivered_date': { $gte: startOfWeek, $lt: endOfWeek },
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
          order_item: {
            $filter: {
              input: '$order_item',
              as: 'item',
              cond: {
                $and: [
                  { $gte: ['$$item.delivered_date', startOfWeek] },
                  { $lte: ['$$item.delivered_date', endOfWeek] },
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
          from: 'coupens', // Name of the Coupen collection in your database
          localField: 'coupen_id', // Field in the Order collection
          foreignField: '_id', // Corresponding field in the Coupen collection
          as: 'coupen_details',
        },
      },
    ]);

    console.log('Orders for the Week:', orders);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching weekly report:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'Unable to fetch weekly report',
        error,
      });
  }
};

const monthReportHandle = async (req, res, next) => {
  try {
    const today = new Date();

    const startOfYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0); // Month is 0-indexed (January = 0)

    const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // Month is 0-indexed (December = 11)

    console.log('Start of Year:', startOfYear);
    console.log('End of Year:', endOfYear);

    // Fetch orders within the year
    const orders = await Order.aggregate([
      {
        $match: {
          'order_item.delivered_date': { $gte: startOfYear, $lte: endOfYear },
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
          order_item: {
            $filter: {
              input: '$order_item',
              as: 'item',
              cond: {
                $and: [
                  { $gte: ['$$item.delivered_date', startOfYear] },
                  { $lte: ['$$item.delivered_date', endOfYear] },
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
    ]);

    console.log('Orders for the Year:', orders);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

const customReportHandle = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.aggregate([
      {
        $match: {
          'order_item.delivered_date': { $gte: startOfDay, $lte: endOfDay },
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
          order_item: {
            $filter: {
              input: '$order_item',
              as: 'item',
              cond: {
                $and: [
                  { $gte: ['$$item.delivered_date', startOfDay] },
                  { $lte: ['$$item.delivered_date', endOfDay] },
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
    ]);

    console.log(orders);
    res.status(200).json({ message: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching report' });
  }
};

module.exports = {
  todayreportHandle,
  weekreportHandle,
  monthReportHandle,
  customReportHandle,
};
