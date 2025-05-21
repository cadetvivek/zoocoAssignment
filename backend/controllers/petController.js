
const Pet = require('../models/Pet');
const Reminder = require('../models/Reminder');

  exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.userId });
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ _id: req.params.petId, owner: req.user.userId });
    if (!pet) return res.status(404).json({ error: 'Pet not found' });
    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createPet = async (req, res) => {
  try {
    const { name, type, breed } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }
    const pet = new Pet({ name, type, breed, owner: req.user.userId });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Pet name must be unique per user' });
    }
    res.status(500).json({ error: err.message });
  }
};


exports.updatePet = async (req, res) => {
  try {
    const { name, type, breed } = req.body;
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.petId, owner: req.user.userId },
      { name, type, breed },
      { new: true, runValidators: true }
    );
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found or not owned by user' });
    }
    res.json(pet);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Pet name must be unique per user' });
    }
    res.status(500).json({ error: err.message });
  }
};


exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findOneAndDelete({ _id: req.params.petId, owner: req.user.userId });
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found or not owned by user' });
    }
    await Reminder.deleteMany({ pet: req.params.petId });
    res.json({ message: 'Pet and associated reminders deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
