const express = require('express');
const router = express.Router();
const { getRepository, getUser } = require('../Controllers/user.controller');

router.get('/repo/:username', getRepository);

router.get('/user/:username', getUser);

module.exports = router;
