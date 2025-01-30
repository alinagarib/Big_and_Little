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
    // Parse request body and create hashed password
    const { name, year, username, email, password } = req.body;

    if (password === undefined || password === "") {
        return res.status(400).send("Password is required!");
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

        // Save new user to DB
        await user.save();
        
        return res.status(200).send();
    } 
    catch (err) {
        if (err instanceof Error.ValidationError) { // User did not pass schema validation
            const messages = Object.values(err.errors).map(e => e.message).join("\n");
            return res.status(400).send(messages);
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

        // Get all profiles associated with the current User
        const rolesResult = await User.aggregate([
            {
              $lookup: {
                from: 'profiles',
                localField: '_id',
                foreignField: 'userId',
                as: 'profileDocs'
              }
            },
            {
              $unwind: '$profileDocs'
            },
            {
              $group: {
                _id: '$_id',
                roles: { $addToSet: '$profileDocs.roles' }, // add profile roles to result
                organization: { $first: '$profileDocs.organizationId' } // add profile organizations to result
              }
            }
        ]);

        let adminOrgs = [];
        for (let i = 0; i < rolesResult.length; i++) {
            console.log(rolesResult[i]);

            let { roles, organization } = rolesResult[i];

            if (roles[i].includes('Admin')) {
                adminOrgs.push(organization);
            }
        }

        console.log(adminOrgs);

        // Issue JWT
        const accessToken = jwt.sign(
            {
                'UserInfo': {
                    'username': user.username,
                    'admin_orgs': adminOrgs
                }
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        return res.status(200).send(accessToken);
    } 
    catch (err) { // Server error (Probably a Mongoose connection issue)
        return res.status(500).send();
    }
}

module.exports = { registerUser, loginUser };