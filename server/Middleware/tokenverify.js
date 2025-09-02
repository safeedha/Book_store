const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  const accessToken = req.cookies.admin_accessToken;
  if (!accessToken) {
    return handleTokenRenewal(req, res, next);
  }
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return handleTokenRenewal(req, res, next);
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = decoded;
    next();
  });
};

const handleTokenRenewal = (req, res, next) => {
  const refreshToken = req.cookies.admin_refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: 'Refresh token not found. Please log in again.' });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: 'Invalid refresh token. Please log in again.' });
    }

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    next();
  });
};

module.exports = { verifyUser };
