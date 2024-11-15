const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.route('/image/upload/:bucket')
    .post(imageController.uploadImage);

router.route('/image/:bucket/:id')
    .get(imageController.getImage);

module.exports = router;