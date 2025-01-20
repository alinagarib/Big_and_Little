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
    // Parse request body and create hashed password
    const { name, year, username, email, password } = req.body;

    //create the error message and invalid inputs list
    invalidInputs = "";
    returningMessage = "";
    if (!name || name.length < 1) {
        invalidInputs += 'fullname';
        returningMessage += 'Cannot register new user, no name was provided!\n\n';
    }

    if (year === undefined) {
        invalidInputs += 'year';
        returningMessage += 'Cannot register new user, no year was provided!\n\n';
    }
    // Validate year
    const validYear = validateYear(year);
    if (!validYear.valid) {
        invalidInputs += 'year';
        returningMessage += validYear.reason + `\n\n`;
    }

    //had to use this because it was saying it wasnt undefined even when it was empty
    if (!username || username.length < 1) {
        invalidInputs += 'username';
        returningMessage += 'Cannot register new user, no username was provided!\n\n';
        
    }

    // Validate username
    const validUsername = validateUsername(username);
    if (!validUsername.valid) {
        invalidInputs += 'username';
        returningMessage += validUsername.reason + `\n\n`;
    }

    // Validate email
    const validEmail = validateEmail(email);
    if (!validEmail.valid) {
        invalidInputs += 'email';
        returningMessage += validEmail.reason + `\n\n`;
    }

    if (password === undefined) {
        invalidInputs += 'password';
        returningMessage += 'Cannot register new user, no password was provided!\n\n';
    }

    // Validate password
    const validPassword = validatePassword(password);
    if (!validPassword.valid) {
        invalidInputs += 'password';
        returningMessage += validPassword.reason + `\n\n`;
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = new User({
            name,
            year,
            username,
            email,
            password: hashedPassword
        });

        // Check if user already exists in DB
        //only check DB if username valid
        if(!invalidInputs.includes('username')){
            if (await User.findOne({ username }) !== null) {
                invalidInputs += 'username';
                returningMessage += 'Cannot register new user, username already exists!\n\n';
            }
        }
        //only check DB if email valid
        if(!invalidInputs.includes('email')){
            if (await User.findOne({ email }) !== null) {
                invalidInputs += 'email';
                returningMessage += 'Cannot register new user, email already exists!\n\n';
            }
        }

        //if there is something invalid throw error
        if(invalidInputs.length > 0){
            returningMessage = returningMessage.slice(0, -2);
            //return both the error message and the invalid inputs to be used in register.js
            return res.status(400).send(returningMessage + "|" + invalidInputs);
        }

        // Save new user to DB
        await user.save();
        return res.status(200).json({ message: `New user '${username}' created.` });
    } 
    catch (err) {
        if (err instanceof Error.ValidationError) { // User did not pass schema validation
            return res.status(400).send(err.message);
        } 
        else { // Server error (Probably a Mongoose connection issue)
            return res.status(500).send();
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

        return res.status(200).send(token);
    } 
    catch (err) { // Server error (Probably a Mongoose connection issue)
        return res.status(500).send();
    }
}

module.exports = { registerUser, loginUser };