var express = require('express');
var router = express.Router();
var base = require('./base/base');
var challenge = require('../controllers/challengeController');

router.post('/challenges/:idChallenge', base.requireLogin, challenge.checkFlagAndInsert);

router.post('/challenges/proposerSolution/:idChallenge', base.requireLogin, challenge.proposeSolution);

router.post('/challenges/success/:idChallenge', base.requireLogin, challenge.isChallengeValidated);

router.post('/challenges/solution/:idChallenge', base.requireLogin, challenge.getSolutionsOfChallenge);

module.exports = router;