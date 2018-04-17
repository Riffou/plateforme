var express = require('express');
var router = express.Router();
var utilisateurs = require('../controllers/utilisateurController');
var base = require('./base/base');

router.post('/', base.requireLogin, utilisateurs.changeMDP);

router.get('/', base.requireLogin, utilisateurs.runProfil);

module.exports = router;