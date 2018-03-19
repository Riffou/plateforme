var express = require('express');
var router = express.Router();
var menuUnites = require('../controllers/menuUnitesController');
var menuParties = require('../controllers/menuCoursController');
var partie = require('../controllers/coursController');

router.get('/', function(req, res) {
    res.render('home.ejs');
});

router.get('/unites/', function(req, res) {
    menuUnites.run(req, res);
});

router.get('/unites/:numeroUnite', function(req, res) {
    menuParties.run(req, res);
});

router.get('/unites/:numeroUnite/partie/:numeroPartie', function(req, res) {
    partie.run(req, res);
});

router.get('/challenges/', function(req, res) {
    res.render('challenges.ejs');
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
