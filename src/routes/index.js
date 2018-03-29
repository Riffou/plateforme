var express = require('express');
var router = express.Router();
var menuUnites = require('../controllers/menuUnitesController');
var menuCours = require('../controllers/menuCoursController');
var cours = require('../controllers/coursController');
var menuChallenges = require('../controllers/menuChallengesController');
var challenge = require('../controllers/challengeController');
var utilisateurs = require('../controllers/utilisateurController');

function requireLogin (req, res, next) {
    if (!req.user) {
        res.redirect('/connexion');
    } else {
        next();
    }
}

function isAlreadyLogged(req, res, next) {
    if (req.user) {
        res.redirect('/');
    }
    else {
        next();
    }
}

router.get('/', requireLogin, function(req, res) {
    var inscription = req.query.inscription;
    var connexion = req.query.connexion;
;    if (inscription == "ok") {
        res.render('home.ejs', {message: "Votre compte a bien été créé, bienvenue !"});
    }
    else if (connexion == "ok") {
        res.render('home.ejs', {message: "Connexion réussie !"});
    }
    else {
        res.render('home.ejs');
    }
});

router.get('/inscription/', isAlreadyLogged, function(req, res) {
   res.render('inscription.ejs');
});

router.post('/inscription/', isAlreadyLogged, utilisateurs.runInscription);

router.get('/connexion/', isAlreadyLogged, function(req, res) {
    res.render('connexion.ejs');
});

router.post('/connexion/', isAlreadyLogged, utilisateurs.runConnexion);

router.get('/deconnexion', requireLogin, function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/oublie/', isAlreadyLogged, function(req, res) {
    res.render('motDePasseOublie.ejs');
});

router.post('/oublie/', isAlreadyLogged, utilisateurs.reinitialiseMDP);

router.post('/profil/', requireLogin, utilisateurs.changeMDP);


router.get('/profil/', requireLogin, utilisateurs.runProfil);

router.get('/unites/', requireLogin, menuUnites.run);

router.get('/unites/:idUnite', requireLogin, menuCours.run);

router.get('/unites/:idUnite/:idCours', requireLogin, cours.run);

router.get('/challenges/', requireLogin, menuChallenges.run);

router.get('/challenges/:idChallenge', requireLogin, challenge.run);

// AJAX
router.post('/api/challenges/:idChallenge', requireLogin, challenge.checkFlagAndInsert);

router.post('/api/challenges/success/:idChallenge', requireLogin, challenge.isChallengeValidated);

router.post('/api/challenges/solution/:idChallenge', requireLogin, challenge.validadateAndGetSolutionOfChallenge);

router.get('/faq/', requireLogin, function(req, res) {
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
