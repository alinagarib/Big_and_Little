const Profile = require('../models/Profile');
const mongoose = require('mongoose');

// Creates a new profile
exports.createProfile = async (req, res) => {
  try {
    const { userId, bio, organizationId, profilePicture, uploadPictures } = req.body;

    // Check if uploadPictures length exceeds max limit of 4
    if (uploadPictures && uploadPictures.length > 4) {
      return res.status(400).json({ message: 'Maximum of 4 pictures allowed' });
    }

    const profile = new Profile({
      userId,
      bio,
      organizationId,
      profilePicture,
      uploadPictures,
      roles: ['Member']
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get profile by user ID
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Updates profile
exports.updateProfile = async (req, res) => {
  try {
    const { bio, profilePicture, uploadPictures } = req.body;

    // Checks if uploadPictures length exceeds max limit, 4
    if (uploadPictures && uploadPictures.length > 4) {
      return res.status(400).json({ message: 'Maximum of 4 pictures allowed' });
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.params.userId },
      { bio, profilePicture, uploadPictures },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Deletes profile
exports.deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
