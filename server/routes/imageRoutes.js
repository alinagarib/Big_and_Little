const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for organization logos
router.route('/image/:key')
    .get(imageController.getPublicImage);

// Protected routes that require authentication
router.use('/image/protected', authMiddleware);
router.use('/image/upload', authMiddleware);
router.use('/image/delete', authMiddleware);

// Protected route for profile images
router.route('/image/protected/:key')
    .get(imageController.getProtectedImage);

// Upload routes
router.route('/image/upload/profile')
    .post(
        imageController.uploadMiddleware, 
        imageController.uploadProfileImage
    );

router.route('/image/upload/organization')
    .post(
        imageController.uploadMiddleware, 
        imageController.uploadOrganizationLogo
    );

// Delete image route
router.route('/image/delete/:key')
    .delete(imageController.deleteImage);

module.exports = router;