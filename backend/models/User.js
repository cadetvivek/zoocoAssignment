// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String, required: true, minlength: 6
  },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving (bcrypt with 10 salt rounds)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare plaintext password with hashed
UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
