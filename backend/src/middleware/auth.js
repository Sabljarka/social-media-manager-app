const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

const checkPermission = (platform) => {
  return (req, res, next) => {
    if (req.user.role === 'admin' || req.user.permissions[platform]) {
      return next();
    }
    res.status(403).json({ message: `No permission for ${platform}` });
  };
};

module.exports = { auth, checkPermission }; 