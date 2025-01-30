const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Sample Route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Auth Routes
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/profileRoutes'));

// Protected Routes
/* Use authMiddleware
const verifyToken = require('./authMiddleware');
app.get('/protected', verifyToken, (req, res) => {
    res.status(200).send('Accessed protected route!');
});
*/

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
