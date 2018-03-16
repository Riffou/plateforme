var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.render('home.ejs');
});

router.get('/unites/', function(req, res) {
    res.render('menuUnites.ejs');
});

router.get('/unites/:numeroUnite', function(req, res) {
    var unite = 'unite' + req.params.numeroUnite + '.ejs';
    res.render(unite);
});

router.get('/unites/:numeroUnite/partie/:numeroPartie', function(req, res) {
    var cours = 'unite' + req.params.numeroUnite + '_' + req.params.numeroPartie + '.ejs';
    var precedent, suivant;

    // Check if previous button to navigate between courses is needed
    if (req.params.numeroPartie == 1) {
        precedent = false;
    }
    // Check if next button to navigate between courses is needed
    res.render(cours, {precedent: precedent, suivant: suivant});
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
