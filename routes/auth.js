const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const GeoNote = require('../models/GeoNote');


const router = express.Router();

const jwt = require('jsonwebtoken');

// Register User
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (no need to hash here, the middleware will handle it)
    const user = new User({
        username,
        password
    });

    try {
        const savedUser = await user.save();
        res.json({ message: 'User registered successfully', userId: savedUser._id });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err });
    }
});


// Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log("Received username:", username);  // Debug log

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
        console.log("User not found in database");  // Debug log
        return res.status(400).json({ message: 'Invalid username' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).json({ message: 'Logged in successfully', token: token });
});

// Get User Data
router.get('/user-data', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Error fetching user data:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch public notes from nearby locations
// router.get('/nearby', auth, async (req, res) => {
    router.get('/nearby', async (req, res) => {
    const { latitude, longitude } = req.query;
    const maxDistance = 5000;  // 5 kilometers, you can adjust this value
  
    try {
      const notes = await GeoNote.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: maxDistance
          }
        },
        isPublic: true
      });

      console.log("Nearby Notes longitude : ", longitude)
      console.log("Nearby Notes : ", notes)
  
      res.json(notes);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching nearby notes', error: err });
    }
  });




module.exports = router;