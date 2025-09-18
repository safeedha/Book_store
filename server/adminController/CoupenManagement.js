const Coupen = require('../Model/Coupen');

const createCoupen = async (req, res, next) => {
  try {
    const {
      copencode,
      copentype,
      minimumPurchase,
      discount,
      limit,
      selectedDate,
    } = req.body;
    const coupen = await Coupen.findOne({
      coupenCode: copencode,
      status: 'active',
    });
    if (coupen) {
      return res.status(409).json({ message: 'This code already exist' });
    }
    const newCoupen = new Coupen({
      coupenCode: copencode,
      coupenType: copentype,
      minimumPurchase: minimumPurchase,
      discountedAmount: discount,
      usageLimit: limit,
      expiryDate: selectedDate,
    });
    await newCoupen.save();

    return res
      .status(201)
      .json({ message: 'Coupon created successfully', coupon: newCoupen });
  } catch (error) {
    next(error);
  }
};

const editCoupen = async (req, res, next) => {
  try {
    const { id } = req.params; // coupon id from URL
    const {
      copencode,
      copentype,
      minimumPurchase,
      discount,
      limit,
      selectedDate,
      status
    } = req.body;

   
    const coupen = await Coupen.findById(id);
    if (!coupen) {
      return res.status(404).json({ message: "Coupon not found" });
    }

 
    if (copencode && copencode !== coupen.coupenCode) {
      const existing = await Coupen.findOne({ coupenCode: copencode, status: "active" });
      if (existing) {
        return res.status(409).json({ message: "This code already exists" });
      }
    }

   
    coupen.coupenCode = copencode || coupen.coupenCode;
    coupen.coupenType = copentype || coupen.coupenType;
    coupen.minimumPurchase = minimumPurchase ?? coupen.minimumPurchase;
    coupen.discountedAmount = discount ?? coupen.discountedAmount;
    coupen.usageLimit = limit ?? coupen.usageLimit;
    coupen.expiryDate = selectedDate || coupen.expiryDate;
    coupen.status = status || coupen.status;

    await coupen.save();

    return res.status(200).json({ message: "Coupon updated successfully", coupon: coupen });
  } catch (error) {
    next(error);
  }
};

const getAllCopen = async (req, res, next) => {
  try {
    let { page = 1, rowsPerPage = 10 } = req.query;
    page = parseInt(page);
    rowsPerPage = parseInt(rowsPerPage);
    const total = await Coupen.countDocuments({ status: 'active' });
    const coupen = await Coupen.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * rowsPerPage)
      .limit(rowsPerPage);

    res.status(200).json({ 
      message: 'success', 
      coupen, 
      totalPages: Math.ceil(total / rowsPerPage)
    });
  } catch (error) {
    next(error);
  }
};


const deletCoupen = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Coupen.updateOne({ _id: id }, { $set: { status: 'deactive' } });

    const coupenall = await Coupen.find({ status: 'active' }).sort({
      createdAt: -1,
    });

    res.status(200).json({ message: 'sucess', coupen: coupenall });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCoupen,
  getAllCopen,
  deletCoupen,
  editCoupen
};
