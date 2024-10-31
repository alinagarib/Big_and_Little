const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  bio: {
    type: String,
    maxlength: 500, // Limited to 500 characters
    default: ''
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  profilePicture: {
    type: String, // Stores the path to the profile picture
    validate: {
      validator: function(v) {
        return /\.(jpeg|jpg|png)$/i.test(v); // Only allows jpeg, jpg, png files
      },
      message: props => `${props.value} is not a valid image format!`
    },
    default: null
  },
  uploadPictures: {
    type: [String], // Array of picture paths
    validate: {
      validator: function(arr) {
        return arr.length <= 4; // Maximum of four pictures
      },
      message: props => `You can only upload a maximum of 4 pictures!`
    }
  }
}, {
  timestamps: true // createdAt and updatedAt timestamps
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
