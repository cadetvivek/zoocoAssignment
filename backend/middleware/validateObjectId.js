// middleware/validateObjectId.js
const mongoose = require('mongoose');
module.exports = (param) => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    return res.status(400).json({ error: `Invalid ${param}` });
  }
  next();
};
