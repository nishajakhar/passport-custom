let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const DOCUMENT_NAME = 'User';
COLLECTION_NAME = 'users';

const schema = new Schema({
  username: String,
  email: String,
  image: String,
  github_url: String,
  followers: Number,
  followingCount: Number,
  repoCount: Number,
  memberSince: Date,
});

module.exports = mongoose.model(DOCUMENT_NAME, schema, COLLECTION_NAME);
