const express = require("express");
const router = express.Router();
const {User} = require('../model/fitness.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateJWT(user) {
  return jwt.sign({ id: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });
}

const { authenticateJWT } = require("../middlewares/middlewares.js")
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      emailAddress: req.body.email,
      password: hashedPassword,
     profilePic:req.body.profilePic,
      bio:req.body.bio,
      otp:req.body.name,
    });

    const newUser = await user.save();
    const token = generateJWT(newUser);
    res.json({ token: token });
  } catch (error) {
    res.status(500).send('Error creating user');
     console.error("Signup error:", error);
  res.status(500).send('Error creating user')
  }
  
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ emailAddress: req.body.email });
  if (!user) {
    return res.status(400).send('User not found');
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  const token = generateJWT(user);
  res.json({ token: token });
});

module.exports = router;