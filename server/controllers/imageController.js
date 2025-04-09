const multer = require('multer');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const { s3Client } = require('../config/aws');
const Profile = require('../models/Profile');

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload image with proper organization and profile paths
const uploadProfileImage = async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'Please provide image data!' });
    }

    // const bucket = req.params.bucket;
    const profileId = req.body.profileId;
    const organizationId = req.body.organizationId;
    
    /*if (!bucket) {
      return res.status(400).json({ error: 'Cannot upload image without specifying bucket!' });
    }*/
    
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required!' });
    }
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required!' });
    }

    // Generate unique filename
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Use organization/profile path structure for better organization
    const key = `profile-images/${organizationId}/${profileId}/${fileName}`;
    console.log('Uploading to S3 with key:', key);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);
    console.log('Successfully uploaded to S3');

    // Return the full key which will be stored in the profile
    return res.status(200).json({ id: key });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Error uploading image', details: error.message });
  }
};

// Upload image with proper organization
const uploadOrganizationLogo = async (req, res) => {
  try {
    console.log('Upload request received');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ error: 'Please provide image data!' });
    }

    // const bucket = req.params.bucket;
    const organizationId = req.body.organizationId;
    
    /*if (!bucket) {
      return res.status(400).json({ error: 'Cannot upload image without specifying bucket!' });
    }*/
    
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required!' });
    }

    // Generate unique filename
    const fileExtension = req.file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Use organization/profile path structure for better organization
    const key = `organization-images/${organizationId}/${fileName}`;
    console.log('Uploading to S3 with key:', key);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);
    console.log('Successfully uploaded to S3');

    // Return the full key which will be stored in the profile
    return res.status(200).json({ id: key });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Error uploading image', details: error.message });
  }
};

// Get image with organization access verification
const getProtectedImage = async (req, res) => {
  try {
    const fullKey = req.params.key;
    
    if (!fullKey) {
      console.log('Please provide an image key!');
      return res.status(400).json({ error: 'Please provide an image key!' });
    }
    
    // Verify this is for profile images
    if (!fullKey.startsWith('profile-images/')) {
      console.log('Invalid image path');
      return res.status(403).json({ error: 'Invalid image path' });
    }

    // Extract organization ID from the key path
    // Format: profile-images/organizationId/profileId/filename
    const pathParts = fullKey.split('/');
    
    if (pathParts.length < 4) {
      console.log('Invalid image key format');
      return res.status(400).json({ error: 'Invalid image key format' });
    }
    
    const orgId = pathParts[1];
    
    // Check if user has access to this organization
    const userOrgs = req.profiles.map((profile) => {return profile.organizationId }) || [];
    if (!userOrgs.includes(orgId)) {
    console.error('Access denied - you do not have permission to access this organization');
      return res.status(403).json({ error: 'Access denied - you do not have permission to access this organization' });
    }

    // Generate presigned URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fullKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error('Error getting protected image:', error);
    return res.status(500).json({ error: 'Error retrieving image' });
  }
};

const getPublicImage = async (req, res) => {
  try {
    const fullKey = req.params.key;
    if (!fullKey) {
      return res.status(400).json({ error: 'Please provide an image key!' });
    }
    
    // Verify this is only for organization logos (security check)
    if (!fullKey.startsWith('organization-images/')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate presigned URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fullKey,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error('Error getting image:', error);
    return res.status(500).json({ error: 'Error retrieving image' });
  }
};

// Delete image
const deleteImage = async (req, res) => {
  try {
    const fullKey = req.params.key;
    
    if (!fullKey) {
      return res.status(400).json({ error: 'Please provide an image key!' });
    }
    
    // Extract organization ID from the key path
    const pathParts = fullKey.split('/');
    
    if (pathParts.length < 3) {
      return res.status(400).json({ error: 'Invalid image key format!' });
    }
    
    // Verify the user has access to this organization
    const orgId = pathParts[1];
    const userOrgs = req.user.organizations || [];
    
    if (!userOrgs.includes(orgId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fullKey,
    });

    await s3Client.send(command);

    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ error: 'Error deleting image' });
  }
};

module.exports = { 
  uploadProfileImage,
  uploadOrganizationLogo,
  getPublicImage, 
  getProtectedImage, 
  deleteImage,
  uploadMiddleware: upload.single('image') 
};