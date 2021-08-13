const dotenv = require('dotenv');
dotenv.config();
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const session = require('express-session');

const bodyParser = require('body-parser'); // Middleware
const routes = require('./Routes/auth.route');
const passport = require('passport');
require('./Core/passport');
require('./Core/connection');

app.use(
  session({
    secret: 'okay',
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log('I am request...', req.body, req.isAuthenticated);
  next();
});
app.use('/static', express.static('static'));
const port = process.env.PORT || 3000; // Port we will listen on
app.use('/', routes);
app.use((req, res, next) => {
  res.status(404).send('Error Code : 404 Not Found');
});
app.use((err, req, res, next) => {
  res.status(404).send('Error Code : 404 Not Found');
});
// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
