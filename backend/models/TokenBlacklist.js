// models/TokenBlacklist.js
const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expires: { type: Date, required: true }
});
// TTL index to auto-delete expired tokens
TokenBlacklistSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);
