const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/register')
    .post(userController.registerUser);

module.exports = router;