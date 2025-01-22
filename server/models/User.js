// MONGOOSE DATA MODEL FOR USERS
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true,
        enum: ['Freshman', 'Sophomore', 'Junior', 'Senior']
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: { 
        type: String,
        required: true
    },
    // TODO: Determine user preferences (not necessary at account creation)
    // NOTE: User preferences may be better stored as an object e.g. { prefID: <int ID>, userPref: <bool pref> }
    preferences: [{
        type: String,
        required: false
    }]
});

module.exports = mongoose.model('User', userSchema);