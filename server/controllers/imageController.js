const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Image ID returned by mock requests
const MOCK_IMAGE_ID = "MOCK_IMAGE_ID";

// @desc Upload image to bucket, returning id
// @route POST /image/upload/:bucket
// @access Authenticated
// NOTE: This route is currently mocked
const uploadImage = [
  upload.single('image'),
  (req, res) => {
    // Ensure request has Content-Type "multipart/form-data"
    if (!req.is('multipart/form-data')) {
      return res.status(400).send('Image upload should be multipart/form-data!');
    }

    // Ensure image data was provided
    const imageData = req.file;
    if (imageData === undefined) {
      return res.status(400).send('Please provide image data!');
    }

    // Get bucket for image upload
    const bucket = req.params.bucket;
    if (bucket === undefined) {
      return res.status(400).send('Cannot upload image without specifying bucket!');
    }

    // TODO: Use image uploading service
    return res.status(200).send(MOCK_IMAGE_ID);
  }
]

// @desc Get image from bucket with ID
// @route GET /image/:bucket/:id
// @access Public
// NOTE: This route is currently mocked
const getImage = (req, res) => {
  // Ensure bucket was provided
  const bucket = req.params.bucket;
  if (bucket === undefined) {
    return res.status(400).send('Please provide an image bucket!');
  }

  // Ensure id was provided
  const id = req.params.id;
  if (id === undefined) {
    return res.status(400).send('Please provide an image ID!');
  }

  // TODO: Retrieve image from service
  let image = `Please use ${MOCK_IMAGE_ID}`;
  if (id === MOCK_IMAGE_ID) {
    switch (bucket) {
      case "profile": {
        image = "https://xsgames.co/randomusers/avatar.php?g=male";
        break;
      }
      case "organization": {
        image = "https://picsum.photos/200";
        break;
      }
      default: {
        image = "Add bucket to mock retrieval service";
        break;
      }
    }
  }

  return res.status(200).send(image);
}

module.exports = { uploadImage, getImage };