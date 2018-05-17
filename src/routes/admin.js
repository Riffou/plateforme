var express = require('express');
var router = express.Router();
var base = require('./base/base');
var administrateurs = require('../controllers/adminController');

router.get('/', base.isAlreadyLoggedAdmin, function(req, res) {
    res.render('admin.ejs');
});

router.post('/', base.isAlreadyLoggedAdmin, administrateurs.runConnexion);

router.get('/dashboard/', base.requireLoginAdmin, administrateurs.runDashboard);

router.get('/dashboard/:idUnite', base.requireLoginAdmin, administrateurs.runDashboardUnite);

router.post('/dashboard/', base.requireLoginAdmin, administrateurs.saveDashboard);

// Sauvegarde des modifications faites directement sur le dashboard
router.post('/dashboard/categories/update/', base.requireLoginAdmin, administrateurs.updateCategories);

router.get('/dashboard/categories/delete/:idUnite', base.requireLoginAdmin, administrateurs.deleteCategorie);

router.get('/dashboard/categories/form/', base.requireLoginAdmin, administrateurs.runCategorie);

router.get('/dashboard/categories/form/:idUnite', base.requireLoginAdmin, administrateurs.runCategorie);

router.post('/dashboard/categories/form/', base.requireLoginAdmin, administrateurs.addCategorie);

// Sauvegarde des modifications faites dans la vue formCategorie
router.post('/dashboard/categories/form/:idUnite', base.requireLoginAdmin, administrateurs.saveModifiedCategorie);

router.post('/dashboard/cours/', base.requireLoginAdmin, administrateurs.getCoursFromCategorie);

// Ajout d'un cours
router.get('/dashboard/cours/form/', base.requireLoginAdmin, administrateurs.runCours);
router.get('/dashboard/cours/form/:idUnite', base.requireLoginAdmin, administrateurs.runCours);

// Sauvegarde des modifications faites au niveau du dashboard
router.post('/dashboard/cours/update/', base.requireLoginAdmin, administrateurs.updateCours);

router.get('/dashboard/cours/delete/:idUnite/:idCours', base.requireLoginAdmin, administrateurs.deleteCours);

router.get('/suivi/', base.requireLoginAdmin, administrateurs.runSuivi);

// Ouverture du formulaire pour modifier un cours
router.get('/dashboard/cours/form/modify/:idCours', base.requireLoginAdmin, administrateurs.editCours);

// Envoi du formulaire de création d'un cours
router.post('/dashboard/cours/form/', base.requireLoginAdmin, administrateurs.addCours);

// Sauvegarde du cours après modification dans formCours
router.post('/dashboard/cours/form/edit/:idCours', base.requireLoginAdmin, administrateurs.saveModifiedCours);

router.post('/dashboard/cours/form/ordre/:idUnite', base.requireLoginAdmin, administrateurs.getSelectOrdreFromCategorie);

router.get('/deconnexion', base.requireLoginAdmin, function(req, res) {
    req.session.destroy();
    res.redirect('/admin');
});

module.exports = router;