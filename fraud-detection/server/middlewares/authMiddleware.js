const jwt = require('jsonwebtoken');
require('dotenv').config();

// ✅ Middleware for Vendor Authentication
const authenticateVendor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // ✅ Ensure token exists and follows 'Bearer <token>' format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No valid token provided.' });
    }
    
    // ✅ Extract actual token (remove 'Bearer ')
    const token = authHeader.split(' ')[1];

    // ✅ Verify JWT token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET)
      
    req.vendor = decoded; // ✅ Store vendor ID in request object
    next();
  

  } catch (error) {
    return res.status(401).json({ message : 'Internal server error' });
  }
};


module.exports = { authenticateVendor};
