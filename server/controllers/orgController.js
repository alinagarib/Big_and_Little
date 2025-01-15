const Organization = require('../models/Organization');
const { Error } = require('mongoose');

const registerOrganization = async (req, res) => {
    try {
        const { role, organizationName, organizationDescription, profilePicture } = req.body;
        // Check if all required fields are provided
        if (!role ||!organizationName ||!organizationDescription ||!profilePicture) {
            return res.status(400).send('Cannot register new organization, all fields are required!');
        }
        // Validate the uploaded file type
        const fileType = req.file.mimetype; // get the file type
        if (fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
            return res.status(400).send('Profile picture must be a JPEG file!');
        }
        const newOrganization = new Organization({
            role,
            organizationName,
            organizationDescription,
            profilePicture
        });
        // Save new organization to DB
        await newOrganization.save();
        return res.status(200).json({ message: `New organization '${organizationName}' created.` });

    } catch (err) {
        if (err instanceof Error.ValidationError) { // Organization did not pass schema validation
            return res.status(400).send(err.message);
        } 
        else { // Server error (Probably a Mongoose connection issue)
            return res.status(500).send();
        }
    }
}

module.exports = { registerOrganization };