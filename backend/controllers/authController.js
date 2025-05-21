
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
   
    const payload = { userId: user._id };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
   
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
    });
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ error: 'Refresh token revoked' });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid refresh token' });
      const payload = { userId: decoded.userId };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.json({ accessToken });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.decode(token);
      const expires = new Date(decoded.exp * 1000);
      await TokenBlacklist.create({ token, expires });
    }
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
