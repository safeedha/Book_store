const User = require('../Model/User');

const getCustomer = async (req, res, next) => {
  try {
    const{page,itemsPerPage}=req.query
    const totalCustomers = await User.countDocuments({});
    const skip = (parseInt(page) - 1) * parseInt(itemsPerPage);
    const limit = parseInt(itemsPerPage);
    let totalPages= Math.ceil(totalCustomers / itemsPerPage)
      const customer = await User.find({})
      .skip(skip) 
      .limit(limit);
    res
      .status(200)
      .json({ message: 'customer fetched sucsessfully', customer,totalPages });
  } catch (error) {
    next(error);
  }
};



const getsingleUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json({ message: 'single user data', user });
    console.log(user);
  } catch (error) {
    next(error);
  }
};

const editChanges = async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { name, email, mobileNo } = req.body;
    const { id } = req.params;
    const update = await User.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          email: email,
          mobileNo: mobileNo,
        },
      }
    );
    if (update.matchedCount === 1) {
      res.status(200).json({ message: 'updation sucessfull' });
    }
  } catch (error) {
    next(error);
  }
};

const statusUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(status);
    const update = await User.updateOne(
      { _id: id },
      {
        $set: {
          status: status,
        },
      }
    );
    if (update.matchedCount === 1) {
      res.status(200).json({ message: 'updation sucessfull' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomer,
  getsingleUser,
  editChanges,
  statusUpdate,
};
