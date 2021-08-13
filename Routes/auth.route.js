const express = require('express');
const router = express.Router();
const path = require('path');
const passport = require('passport');
const { checkAuthenticated } = require('../Core/middleware');
const UserModel = require('../Models/user.model');
const bcrypt = require('bcrypt');
router.get('/login', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});
router.get('/signup', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});
router.get('/dashboard', checkAuthenticated, (req, res, next) => {
  res.sendFile(path.join(__dirname, '../public/members.html'));
});

router.post(
  '/login',
  passport.authenticate('custom', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  }),
);

router.post('/signup', async (req, res) => {
  const foundUser = await UserModel.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  console.log('I am yserrrrrr founddddddddd', foundUser);
  if (foundUser) return res.status(403).send('User Already exist');

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await UserModel.create({
    username: req.body.username,
    email: req.body.email,
    password: passwordHash,
  });
  if (!user) res.status(500).send('Internal Server Error : User Not Registered');
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Route to Homepage
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(err => res.redirect('/login'));
});

module.exports = router;
