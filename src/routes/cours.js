var express = require('express');
var router = express.Router();
var menuUnites = require('../controllers/menuUnitesController');
var menuCours = require('../controllers/menuCoursController');
var cours = require('../controllers/coursController');
var base = require('./base/base');

router.get('/', base.requireLogin, menuUnites.run);

router.get('/:idUnite', base.requireLogin, menuCours.run);

router.get('/:idUnite/:idCours', base.requireLogin, cours.run);

router.post('/:idUnite/:idCours', base.requireLogin, cours.validateReadLesson);

module.exports = router;