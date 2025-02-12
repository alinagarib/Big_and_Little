const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');

router.route('/organizations')
    .get(orgController.getOrganizations);

module.exports = router;