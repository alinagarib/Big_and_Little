const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const verifyToken = require('../middleware/authMiddleware');

// User must be logged in to edit/view profiles
router.use('/profiles', verifyToken);

router.route('/profiles')
  .post(profileController.createProfile);

router.route('/profiles/:profileId')
  .get(profileController.getProfile)
  .put(profileController.updateProfile)
  .delete(profileController.deleteProfile);

module.exports = router;
