const express = require('express');
const User = require('../models/User');
const { Error } = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @desc Register new user
// @route POST /register
// @access Public
const registerUser = async (req, res) => {
    // Parse request body and create hashed password
    const { username, email, password } = req.body;
    if (username === undefined || email === undefined) {
        res.status(400).send('Cannot register new user, no username and/or email was provided!');
        return;
    }

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
        res.status(200).json({ message: `New user '${username}' created.` });
    } 
    catch (err) {
        if (err instanceof Error.ValidationError) { // User did not pass schema validation
            res.status(400).send(err.message);
        } 
        else { // Server error (Probably a Mongoose connection issue)
            res.status(500).send();
        }
    }
}

// @desc Login existing user
// @route POST /login
// @access Public
const loginUser = async (req, res) => {
    const { userID, password } = req.body;
    if (userID === undefined || password === undefined) {
        res.status(400).send('Cannot login user, please provide a userID and password!');
        return;
    }
    
    try {
        // Check if user with username or email exists in DB
        const user = await User.findOne({
            $or: [{ username: userID }, { email: userID }]
        });
        
        if (user === null) {
            res.status(400).send(`Cannot login user, user with username/email ${username} does not exist!`);
            return;
        }

        // Check if password is correct
        if (!(await bcrypt.compare(password, user.password))) {
            res.status(401).send('Cannot login user, incorrect password!');
            return;
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

        res.status(200).json({ message: `User '${user.username}' logged in.` });
    } 
    catch (err) { // Server error (Probably a Mongoose connection issue)
        res.status(500).send();
    }
}

module.exports = { registerUser, loginUser };