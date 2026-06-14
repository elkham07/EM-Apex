const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'emapex_super_secure_jwt_token_secret_string_987654321');
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
