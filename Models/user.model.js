let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const DOCUMENT_NAME = 'User';
COLLECTION_NAME = 'users';

const schema = new Schema({
  username: String,
  email: String,
  password: String,
});

module.exports = mongoose.model(DOCUMENT_NAME, schema, COLLECTION_NAME);
