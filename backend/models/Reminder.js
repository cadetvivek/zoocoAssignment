// models/Reminder.js
const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  notes: { type: String },
  startDateTime: { type: Date, required: true },
  frequency: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  streak: { type: Number, default: 0 },
  lastCompletedAt: { type: Date },
  category: {
    type: String, required: true,
    enum: ['feeding', 'medication', 'grooming', 'exercise']
  },
  timeSlot: {
    type: String, required: true,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night']
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index on owner, pet, category
ReminderSchema.index({ owner: 1, pet: 1, category: 1 });

module.exports = mongoose.model('Reminder', ReminderSchema);
