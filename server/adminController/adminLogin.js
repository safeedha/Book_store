const jwt = require('jsonwebtoken');
const User = require('../Model/User');
const bcrypt = require('bcrypt');

// const ACCESS_TOKEN_SECRET = 'your-access-token-secret';
// const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret';

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const available = await User.findOne({ email });

    if (!available) {
      return res.status(401).json({ message: 'Invalid email and password' });
    }

    if (!available.isAdmin) {
      return res
        .status(403)
        .json({ message: 'Access denied: No admin privileges' });
    }
    const passwordMatch = await bcrypt.compare(password, available.password);
    if (passwordMatch) {
      const accessToken = jwt.sign(
        { id: available._id, email: available.email, role: available.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { id: available._id, email: available.email, role: available.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
      );

      res.cookie('admin_accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('admin_refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ message: 'Admin authenticated', admin: available });
    } else {
      return res.status(401).json({ message: 'Invalid email and password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const dashboard = (req, res) => {
  return res.json({ message: 'Good, you have access to the dashboard' });
};

module.exports = {
  adminLogin,
};
