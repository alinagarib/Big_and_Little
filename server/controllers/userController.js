const User = require('../models/User');
const { Error } = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    validateYear,
    validateUsername,
    validateEmail,
    validatePassword,
} = require("../middleware/userValidation");

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

        // const token = jwt.sign(
        //     { id: newUser._id, username: newUser.username },
        //     process.env.JWT_SECRET,
        //     { expiresIn: "7d" } 
        // );

        return res.status(201).json({
            message: `New user '${username}' created.`,
            user: {
                id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            },
            // token
        });
    }
    catch (err) {
        console.error("❌ Error occurred:", err);
        if (err instanceof Error.ValidationError) { // User did not pass schema validation
            return res.status(400).send(err.message);
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

        // Issue JWT
        const payload = {
            username: user.username
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });

        res.cookie('Authorization', `Bearer ${token}`, {
            httpOnly: true,
            maxAge: 6 * 24 * 60 * 60 * 1000,
            secure: true
        });

        return res.status(200).json({ message: `User '${user.username}' logged in.` });
    }
    catch (err) { // Server error (Probably a Mongoose connection issue)
        return res.status(500).send();
    }
}

module.exports = { registerUser, loginUser };