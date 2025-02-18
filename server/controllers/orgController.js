const Organization = require('../models/Organization');
const { Error } = require('mongoose');

// @desc Get public organizations
// @route GET /organizations
// @access Public
const getOrganizations = async (req, res) => {
    try {
        const orgs = await Organization.find({ isPublic: true, isMatching: false }).exec();
        const orgsArray = orgs.map(org => ({
            id: org.id,
            name: org.name,
            description: org.description,
            logo: org.logo,
            size: org.members.length
        }));
        return res.status(200).send(orgsArray);
    } catch (err) { // Server error (Probably a Mongoose connection issue)
        return res.status(500).send();
    }
}

module.exports = { getOrganizations };