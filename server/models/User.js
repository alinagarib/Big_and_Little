// MONGOOSE DATA MODEL FOR USERS
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // TODO: Hash password using encryption library (bcryptjs ?)
    // NOTE: This should be done at the controller method (endpoint) for the User post request, when the password is initially stored.
    password: { 
        type: String,
        required: true
    },
    roles: [{
        type: String,
        default: "Member"
    }],
    // TODO: Determine user preferences (not necessary at account creation)
    // NOTE: User preferences may be better stored as an object e.g. { prefID: <int ID>, userPref: <bool pref> }
    prefences: [{
        type: String,
        required: false
    }]
});

module.exports = mongoose.model('User', userSchema);