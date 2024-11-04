// MONGOOSE DATA MODEL FOR ORGANIZATIONS
const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Member']
    },
    organizationName: {
        type: String,
        required: true
    },
    organizationDescription: {
        type: String,
        required: true,
        maxLength: 500
    },
    // file path stored in string format
    profilePicture: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Organization', organizationSchema);