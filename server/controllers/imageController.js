const multer = require('multer');
const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const { s3Client } = require('../config/aws');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadImage = async (req, res) => {
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.is('multipart/form-data')) {
        return res.status(400).send('Image upload should be multipart/form-data!');
      }

      const imageData = req.file;
      if (!imageData) {
        return res.status(400).send('Please provide image data!');
      }

      const bucket = req.params.bucket;
      if (!bucket) {
        return res.status(400).send('Cannot upload image without specifying bucket!');
      }

      // Generate unique filename
      const fileExtension = imageData.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${bucket}/${fileName}`,
        Body: imageData.buffer,
        ContentType: imageData.mimetype,
      });

      await s3Client.send(command);

      return res.status(200).json({ id: fileName });
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).send('Error uploading image');
    }
  }
};

const getImage = async (req, res) => {
  try {
    const bucket = req.params.bucket;
    if (!bucket) {
      return res.status(400).send('Please provide an image bucket!');
    }

    const id = req.params.id;
    if (!id) {
      return res.status(400).send('Please provide an image ID!');
    }

    // Generate presigned URL
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${bucket}/${id}`,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    console.error('Error getting image:', error);
    return res.status(500).send('Error retrieving image');
  }
};

module.exports = { uploadImage, getImage };