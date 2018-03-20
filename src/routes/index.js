var express = require('express');
var router = express.Router();
var menuUnites = require('../controllers/menuUnitesController');
var menuCours = require('../controllers/menuCoursController');
var cours = require('../controllers/coursController');
var menuChallenges = require('../controllers/menuChallengesController');
var challenge = require('../controllers/challengeController');

router.get('/', function(req, res) {
    res.render('home.ejs');
});

router.get('/unites/', function(req, res) {
    menuUnites.run(req, res);
});

router.get('/unites/:idUnite', function(req, res) {
    menuCours.run(req, res);
});

router.get('/unites/:idUnite/cours/:idCours', function(req, res) {
    cours.run(req, res);
});

router.get('/challenges/', function(req, res) {

    menuChallenges.run(req, res);
});

router.get('/challenges/:idChallenge', function(req, res) {

    challenge.run(req, res);
});

router.get('/faq/', function(req, res) {
    res.render('faq.ejs');
});

// Exemples du cours

router.get('/exemples/:nomExemple', function(req, res) {
    var exemple = req.params.nomExemple + '.ejs';
    res.render(exemple);
});

router.post('/exemples/:nomExemple', function(req, res) {
    var exemple = req.params.nomExemple + '.ejs';
    res.render(exemple, {recherche: req.body.article});
});

module.exports = router;
