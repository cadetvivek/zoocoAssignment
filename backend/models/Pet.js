// models/Pet.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String, required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Other']
  },
  breed: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Ensure each user’s pet names are unique (compound index on owner+name)
PetSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Pet', PetSchema);
