const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret';

const verifyUsertoken = (req, res, next) => {
  const accessToken = req.cookies.user_accessToken;


  if (!accessToken) {
    return handleTokenRenewal(req, res, next);
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
     
      return handleTokenRenewal(req, res, next);
    }
   
    req.user = decoded;
   
    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. user only.' });
    }
    next();
  });
};

const handleTokenRenewal = (req, res, next) => {
  const refreshToken = req.cookies?.user_refreshToken;


  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found. Please log in again.' });
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error('Refresh token verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid refresh token. Please log in again.' });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email ,role:decoded.role},
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    res.cookie('user_accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    
    req.user = decoded; 
    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Access denied. user only.' });
    }
    
    next(); 
  });
};


module.exports = { verifyUsertoken };
