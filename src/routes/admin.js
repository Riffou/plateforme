var express = require('express');
var router = express.Router();
var base = require('./base/base');
var administrateurs = require('../controllers/adminController');

router.get('/', base.isAlreadyLoggedAdmin, function(req, res) {
    res.render('admin.ejs');
});

router.post('/', base.isAlreadyLoggedAdmin, administrateurs.runConnexion);

router.get('/dashboard/', base.requireLoginAdmin, administrateurs.runDashboard);

router.post('/dashboard/', base.requireLoginAdmin, administrateurs.saveDashboard);

router.post('/dashboard/categories/update/', base.requireLoginAdmin, administrateurs.updateCategories);

router.get('/dashboard/categories/delete/:idUnite', base.requireLoginAdmin, administrateurs.deleteCategorie);

router.get('/dashboard/categories/form/', base.requireLoginAdmin, administrateurs.runCategorie);

router.get('/dashboard/categories/form/:idUnite', base.requireLoginAdmin, administrateurs.runCategorie);

router.post('/dashboard/categories/form/', base.requireLoginAdmin, administrateurs.addCategorie);

router.post('/dashboard/categories/form/:idUnite', base.requireLoginAdmin, administrateurs.modifyCategorie);

router.get('/suivi/', base.requireLoginAdmin, administrateurs.runSuivi);

router.get('/deconnexion', base.requireLoginAdmin, function(req, res) {
    req.session.destroy();
    res.redirect('/admin');
});

module.exports = router;