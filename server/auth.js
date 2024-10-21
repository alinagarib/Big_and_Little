const express = require('express');
const router = express.Router();

const User = require('./models/User');
const { Error } = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    // Parse request body and create hashed password
    const { username, email, password } = req.body;

    if (password === undefined) {
        res.status(400).send('Cannot register new user, no password was provided!');
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        // Check if user already exists in DB
        if (await User.findOne({ email }) !== null) {
            res.status(400).send('Cannot register new user, email already exists!');
            return;
        }
        if (await User.findOne({ username }) !== null) {
            res.status(400).send('Cannot register new user, username already exists!');
            return;
        }

        // Save new user to DB
        await user.save();
        res.status(200).send();
    } catch (err) {
        if (err instanceof Error.ValidationError) { // User did not pass schema validation
            res.status(400).send(err.message);
        } else { // Server error (Probably a Mongoose connection issue)
            res.status(500).send();
        }
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check if user exists in DB
        const user = await User.findOne({ username });
        if (user === null) {
            res.status(400).send(`Cannot login user, user with username ${username} does not exist!`);
            return;
        }

        // Check if password is correct
        if (!(await bcrypt.compare(password, user.password))) {
            res.status(401).send('Cannot login user, incorrect password!');
            return;
        }

        // Issue JWT
        const payload = {
            username
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        });
        res.cookie('Authorization', `Bearer ${token}`, {
            httpOnly: true,
            maxAge: 6 * 24 * 60 * 60 * 1000,
            secure: true
        });
        res.status(200).send();
    } catch (err) { // Server error (Probably a Mongoose connection issue)
        res.status(500).send();
    }
});

module.exports = router;