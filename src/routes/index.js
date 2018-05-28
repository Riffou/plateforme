var express = require('express');
var router = express.Router();
var base = require('./base/base');
var utilisateurs = require('../controllers/utilisateurController');

router.get('/', base.requireLogin, function(req, res) {
    var inscription = req.query.inscription;
    var connexion = req.query.connexion;
    if (inscription == "ok") {
        res.render('home.ejs', {message: "Votre compte a bien été créé, bienvenue !"});
    }
    else if (connexion == "ok") {
        res.render('home.ejs', {message: "Connexion réussie !"});
    }
    else {
        res.render('home.ejs');
    }
});

router.get('/connexion/', base.isAlreadyLogged, function(req, res) {
    if (req.query.message == '1') {
        res.render('connexion.ejs', {message: 'Un email vous a été envoyé pour la réinitialisation de votre mot de passe.'})
    }
    else {
        res.render('connexion.ejs');
    }
});

router.post('/connexion/', base.isAlreadyLogged, utilisateurs.runConnexion);

router.get('/inscription/', base.isAlreadyLogged, function(req, res) {
    res.render('inscription.ejs');
});

router.post('/inscription/', base.isAlreadyLogged, utilisateurs.runInscription);

router.get('/deconnexion', base.requireLogin, function(req, res) {
    if (req.session.admin == null) {
        req.session.destroy();
    }
    else {
        req.session.user = null;
    }
    res.redirect('/');
});

router.get('/oublie/', base.isAlreadyLogged, function(req, res) {
    if (typeof req.query.token != "undefined" && typeof req.query.email != "undefined") {
        utilisateurs.verifieToken(req, res);
    }
    else {
        res.render('motDePasseOublie.ejs');
    }
});

router.post('/oublie/', base.isAlreadyLogged, function(req, res) {
    if (typeof req.query.token != "undefined" && typeof req.query.email != "undefined") {
        utilisateurs.setNouveauMDP(req, res);
    }
    else {
        utilisateurs.reinitialiseMDP(req, res);
    }
});

router.get('/faq/', base.requireLogin, function(req, res) {
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