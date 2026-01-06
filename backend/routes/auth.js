const express = require('express'); // Import express module to create router
const router = express.Router(); // Create a new router object from express
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for generating and verifying tokens
const User = require('../models/User'); // Import the User model to interact with the database

// Register Route
// This route handles user registration
router.post('/register', async (req, res) => {
  try {
    // Destructure name, email, and password from the request body
    const { name, email, password } = req.body;

    // Check if a user with the given email already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      // If user exists, return a 400 Bad Request error
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user in the database with the provided details
    // The password will be hashed by the User model hooks before saving
    const user = await User.create({ name, email, password });

    // Generate a JSON Web Token (JWT) for the newly registered user
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload: user ID and email
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '7d' } // Token expiration time (7 days)
    );

    // Send a 201 Created response with the user details and the token
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    // specific error handling if something fails during registration
    res.status(400).json({ error: error.message });
  }
});

// Login Route
// This route handles user login
router.post('/login', async (req, res) => {
  try {
    // Destructure email and password from the request body
    const { email, password } = req.body;

    // Find the user in the database by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // If user is not found, return 401 Unauthorized error
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // If password is not valid, return 401 Unauthorized error
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a new JWT token for the authenticated user
    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: '7d' } // Expiration
    );

    // Send a 200 OK response with the user details and the token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    // Handle any errors that occur during login
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; // Export the router to be used in server.js