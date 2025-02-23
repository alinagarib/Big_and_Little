const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');

router.route('/organizations')
    .get(orgController.getOrganizations);

router.route('/create-org')
    .post(orgController.createOrganization);

router.route('/is-joined')
    .post(orgController.isJoined);

module.exports = router;