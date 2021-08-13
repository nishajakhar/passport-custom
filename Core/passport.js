const passport = require('passport');
const CustomStrategy = require('passport-custom').Strategy;
const UserModel = require('../Models/user.model');
const { Types } = require('mongoose');
const bcrypt = require('bcrypt');

// Tells Passport to use this strategy for the passport.authenticate() method
passport.use(
  new CustomStrategy(
    // Here is the function that is supplied with the username and password field from the login POST request
    async (req, cb) => {
      console.log('I am hereeee', req.body);
      console.log('User moeeoeooeo', UserModel);
      // Search the MongoDB database for the user with the supplied username
      const foundUser = await UserModel.findOne({ username: req.body.username });

      if (!foundUser) return cb(null, false);

      const isValid = await bcrypt.compare(req.body.password, foundUser.password);
      if (!isValid) return cb(null, false);

      // Since we have a valid user, we want to return no err and the user object
      return cb(null, foundUser);
    },
  ),
);

passport.serializeUser(function(user, cb) {
  console.log(' I am serialize user', user);
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  console.log(' I am deserialize user', id);

  const user = await UserModel.findOne({ _id: new Types.ObjectId(id) });
  console.log('I am ehehehehehehhehehe', user);
  if (!user) return cb(new Error());
  cb(null, user);
});

module.exports = passport;
