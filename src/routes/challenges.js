var express = require('express');
var router = express.Router();
var menuChallenges = require('../controllers/menuChallengesController');
var challenge = require('../controllers/challengeController');
var base = require('./base/base');
var challengeHelper = require('../controllers/challengeHelperController');

router.get('/', base.requireLogin, menuChallenges.run);

router.get('/:idChallenge', base.requireLogin, challenge.run);

router.get('/load/:idChallenge', base.requireLogin, challenge.loadingPageChallenge);

router.post('/start/:idChallenge', base.requireLogin, challenge.loadChallenge);

router.post('/load/5', base.requireLogin, challengeHelper.checkEmptyInputs);

router.post('/load/8', base.requireLogin, challengeHelper.successDisabledButton);

module.exports = router;