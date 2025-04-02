const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();
const { validateSignup, validateLogin } = require('../middleware/validators');
const upload = multer({ dest: 'public/uploads/' });

router.get('/', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    res.render('dashboard', { user });
});

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', upload.single('profileImage'), validateSignup, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    email: req.body.email,
    password: hashedPassword,
    profileImage: `/uploads/${req.file.filename}`
  });
  await user.save();
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', validateLogin, async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.cookie('token', token);
  res.redirect('/dashboard');
});

module.exports = router;