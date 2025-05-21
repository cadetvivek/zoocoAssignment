// routes/petRoutes.js
const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { authenticateToken } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.use(authenticateToken);
router.param('petId', validateObjectId('petId'));

router.get('/', petController.getPets);
router.post('/', petController.createPet);
router.get('/:petId', petController.getPet);
router.put('/:petId', petController.updatePet);
router.delete('/:petId', petController.deletePet);

module.exports = router;
