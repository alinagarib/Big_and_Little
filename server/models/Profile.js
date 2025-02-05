// MONGOOSE DATA MODEL FOR PROFILES
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Profile must be linked to a user!"],
    ref: 'User'
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Profile must be linked to an organization!"],
    ref: 'Organization'
  },
  description: { // Would this make more sense to be called bio?
    type: String,
    maxLength: 500,
    default: ""
  },
  images: {
    type: [String]
  },
  role: {
    type: String,
    required: [true, "Role is required!"],
    enum: ['Big', 'Little']
  },
  numberOfLittles: { // Only applies for Bigs
    type: Number
  },
  ranking: {
    type: Map,
    of: Number
  },
  profilePic: {
    type: String,
    default: "DEFAULT_PROFILE_PIC_ID"
  },
});

module.exports = mongoose.model('Profile', profileSchema);
