const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const orgController = require('../controllers/orgController');

router.route('/organizations')
    .get(orgController.getOrganizations);

router.route('/create-org')
    .post(orgController.createOrganization);

router.route('/is-joined')
    .post(orgController.isJoined);

    router.use('/organizations', verifyToken);

router.route('/organizations/:orgId')
    .get(orgController.getOrganizationById);

router.route('/organizations/:orgId/members')
    .get(orgController.getOrganizationMembers);

module.exports = router;