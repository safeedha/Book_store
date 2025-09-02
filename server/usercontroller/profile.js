const User = require('../Model/User');
const bcrypt = require('bcrypt');

const updateProfile = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (req.body?.editednumber) {
      const phoneexist = await User.findOne({
        mobileNo: req.body?.editednumber,
      });
      if (phoneexist) {
        return res.status(400).json({ message: 'this number already in use' });
      } else {
        let update = await User.updateOne(
          { _id: id },
          {
            $set: {
              mobileNo: req.body?.editednumber,
            },
          }
        );
      }
    }

    if (req.body?.editedname) {
      let update = await User.updateOne(
        { _id: id },
        {
          $set: {
            name: req.body?.editedname,
          },
        }
      );
    }
    const user = await User.findOne({ _id: id });
    res.status(200).json({ message: 'updation sucessfull', user });
  } catch (error) {
    next(error);
  }
};

const chanePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const { newPassword } = req.body;
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = await User.updateOne(
      { _id: id },
      {
        $set: {
          password: passwordHash,
        },
      }
    );
    res.status(200).json({ message: 'password updated sucessefully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  chanePassword,
};
