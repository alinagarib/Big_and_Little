const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/login')
    .post(userController.loginUser);

module.exports = router;