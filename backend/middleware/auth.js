// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
