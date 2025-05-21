const Reminder = require('../models/Reminder');
const Pet = require('../models/Pet');


exports.getReminders = async (req, res) => {
  try {
    const filter = { owner: req.user.userId };
    const queryParams = { ...req.query }; 
    
    if (queryParams.pet) {
      filter.pet = queryParams.pet;
    }
    if (queryParams.modifiedSince) {
      const date = new Date(queryParams.modifiedSince);
      if (!isNaN(date)) {
        filter.updatedAt = { $gte: date };
      } else {
        return res.status(400).json({ error: 'Invalid modifiedSince date' });
      }
    }
    const reminders = await Reminder.find(filter);
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createReminder = async (req, res) => {
  try {
    const { title, notes, startDateTime, frequency, category, timeSlot, pet } = req.body;
    if (!title || !startDateTime || !frequency || !category || !timeSlot || !pet) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const petDoc = await Pet.findOne({ _id: pet, owner: req.user.userId });
    if (!petDoc) {
      return res.status(400).json({ error: 'Invalid pet or unauthorized' });
    }
    const reminder = new Reminder({
      title, notes, startDateTime, frequency, category, timeSlot,
      owner: req.user.userId, pet
    });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateReminder = async (req, res) => {
  try {
    const fields = ['title', 'notes', 'startDateTime', 'frequency', 'category', 'timeSlot'];
    const updateData = {};
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found or not owned by user' });
    }
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found or not owned by user' });
    }
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.completeReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!reminder) {
      return res.status(404).json({ error: 'Reminder not found' });
    }
    reminder.status = 'Completed';
    reminder.streak = (reminder.streak || 0) + 1;
    reminder.lastCompletedAt = new Date();
    await reminder.save();
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
