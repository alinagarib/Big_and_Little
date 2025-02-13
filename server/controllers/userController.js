const User = require('../models/User');
const Profile = require('../models/Profile');
const { Error } = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const validatePassword = (password) => {
    // Checks if its less than 8 characters
    if (password.length < 8) {
        return {
            valid: false,
            reason: "Password must be at least 8 characters!",
        };
    }

    // Limit password to 100 characters
    if (password.length > 100) {
        return {
            valid: false,
            reason: "Password must be less than 100 characters!",
        };
    }

    // Checks if there is an uppercase
    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain an uppercase letter!",
        };
    }

    // Checks if there is a special character
    if (!/[~`! @#$%^&*()_\-+=\{[}\]\|\:;"'<,>\.\?/]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain a special character!",
        };
    }

    // Checks if there is a number
    if (!/[0-9]/.test(password)) {
        return {
            valid: false,
            reason: "Password must contain a number!",
        };
    }

    return {
        valid: true,
    };
};

// @desc Register new user
// @route POST /register
// @access Public
const registerUser = async (req, res) => {
    console.log("📥 Received Data:", req.body);
    // Parse request body and create hashed password
    const { name, year, username, email, password } = req.body;

    if (password === undefined || password === "") {
        return res.status(400).send("Password is required!");
    }
    const validPassword = validatePassword(password);
    if (!validPassword.valid) {
        return res.status(400).send(validPassword.reason);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({
            name,
            year,
            username,
            email,
            password: hashedPassword
        });

        // Save new user to DB
        await newUser.save();
        
        return res.status(200).send();
    } 
    catch (err) {
        console.error("❌ Error occurred:", err);
        if (err instanceof Error.ValidationError) { // User did not pass schema validation
            const messages = Object.values(err.errors).map(e => e.message).join("\n");
            return res.status(400).send(messages);
        } 
        else { // Server error (Probably a Mongoose connection issue)
            console.error("Server error:", err);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }
}

// @desc Login existing user
// @route POST /login
// @access Public
const loginUser = async (req, res) => {
    console.log("📥 Received Data:", req.body);
    const { userID, password } = req.body;
    if (userID === undefined || password === undefined) {
        return res.status(400).send('Cannot login user, please provide a userID and password!');
    }

    try {
        // Check if user with username or email exists in DB
        const user = await User.findOne({
            $or: [{ username: userID }, { email: userID }]
        });

        if (user === null) {
            return res.status(400).send(`Cannot login user, user with username/email ${userID} does not exist!`);
        }

        // Check if password is correct
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Cannot login user, incorrect password!');
        }

        // Fetch user profiles
        const profiles = await Profile.find({ userId: user._id }).populate('organizationId').exec();
        const profilesArray = profiles.map(profile => ({
            id: profile._id,
            isOwner: profile.organizationId.owner.equals(user._id)
        }));
        console.log("✅ Login successful for user:", user.username || user.email);
        // Issue JWT
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'userId': user._id,
                    'profiles': profilesArray
                }
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        return res.status(200).send(accessToken);
    } 
    catch (err) { // Server error (Probably a Mongoose connection issue)
        console.error("❌ Server error during login:", err);
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
    
}

module.exports = { registerUser, loginUser };