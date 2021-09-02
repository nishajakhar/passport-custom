const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
var cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));

const bodyParser = require('body-parser'); // Middleware
const routes = require('./Routes/user.route');
require('./database/connection');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

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
