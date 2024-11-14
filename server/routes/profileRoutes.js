const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Create a new profile
router.post('/', async (req, res) => {
  try {
    const { userId, bio, organizationId, profilePicture, uploadPictures } = req.body;
    const newProfile = new Profile({ userId, bio, organizationId, profilePicture, uploadPictures });
    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId }).populate('organizationId');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Updates profile
router.put('/:userId', async (req, res) => {
  try {
    const { bio, profilePicture, uploadPictures } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { bio, profilePicture, uploadPictures },
      { new: true, runValidators: true }
    );
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Deletes profile
router.delete('/:userId', async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
