var express = require('express');
var router = express.Router();
var menuChallenges = require('../controllers/menuChallengesController');
var challenge = require('../controllers/challengeController');
var base = require('./base/base');

router.get('/', base.requireLogin, menuChallenges.run);

router.get('/:idChallenge', base.requireLogin, challenge.run);

module.exports = router;