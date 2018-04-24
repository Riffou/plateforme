var express = require('express');
var router = express.Router();
var base = require('./base/base');
var administrateurs = require('../controllers/adminController');

router.get('/', base.isAlreadyLoggedAdmin, function(req, res) {
    res.render('admin.ejs');
});

router.post('/', base.isAlreadyLoggedAdmin, administrateurs.runConnexion);

router.get('/dashboard/', base.requireLoginAdmin, function(req, res) {
    res.render('dashboard.ejs');
});

router.get('/suivi/', base.requireLoginAdmin, administrateurs.runSuivi);

router.get('/deconnexion', base.requireLoginAdmin, function(req, res) {
    req.session.destroy();
    res.redirect('/admin');
});

module.exports = router;