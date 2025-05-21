// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { authenticateToken } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.use(authenticateToken);
router.param('id', validateObjectId('id'));

router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.get('/:id', reminderController.getReminder);
router.put('/:id', reminderController.updateReminder);
router.patch('/:id/complete', reminderController.completeReminder);
router.delete('/:id', reminderController.deleteReminder);

module.exports = router;
