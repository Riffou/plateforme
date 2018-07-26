var coursModel = require('../models/cours');
var utilisateurModel = require('../models/utilisateurs');
var config = require('../config/settings').config();

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        var idUnite = req.params.idUnite;
        coursModel.doesUniteExist(idUnite, function(exists, error) {
            if (error == null) {
                if (exists) {
                    coursModel.getMenuCours(idUnite, function (data, error) {
                        if (error == null) {
                            coursModel.getOrdreFromIdUnite(idUnite, function (ordreUnite, error) {
                                if (error == null) {
                                    coursModel.getNomFromIdUnite(idUnite, function (nomUnite, error) {
                                        if (error == null) {
                                            utilisateurModel.getArrayCoursRead(req.user.identifiant, function (coursRead, error) {
                                                if (error == null) {
                                                    // convert json in a array
                                                    var coursReadArray = [];
                                                    for (var i = 0; i < coursRead.length; i++) {
                                                        coursReadArray.push(coursRead[i].idcours);
                                                    }
                                                    res.render('menuCours.ejs', {
                                                        data: data,
                                                        idUnite: idUnite,
                                                        ordreUnite: ordreUnite,
                                                        nomUnite: nomUnite,
                                                        coursReadArray: coursReadArray,
                                                    });
                                                }
                                                else {
                                                    if (config.mode == 'local') {
                                                        res.render('error.ejs', {message: error, error: error});
                                                    }
                                                    else {
                                                        res.render('error.ejs', {
                                                            message: 'Une erreur est survenue.',
                                                            error: "Une erreur est survenue."
                                                        })
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            if (config.mode == 'local') {
                                                res.render('error.ejs', {message: error, error: error});
                                            }
                                            else {
                                                res.render('error.ejs', {
                                                    message: 'Une erreur est survenue.',
                                                    error: "Une erreur est survenue."
                                                })
                                            }
                                        }
                                    });
                                }
                                else {
                                    if (config.mode == 'local') {
                                        res.render('error.ejs', {message: error, error: error});
                                    }
                                    else {
                                        res.render('error.ejs', {
                                            message: 'Une erreur est survenue.',
                                            error: "Une erreur est survenue."
                                        })
                                    }
                                }
                            });
                        }
                        else {
                            if (config.mode == 'local') {
                                res.render('error.ejs', {message: error, error: error});
                            }
                            else {
                                res.render('error.ejs', {
                                    message: 'Une erreur est survenue.',
                                    error: "Une erreur est survenue."
                                })
                            }
                        }
                    });
                }
                else {
                    res.render('404.ejs');
                }
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {
                        message: 'Une erreur est survenue.',
                        error: "Une erreur est survenue."
                    })
                }
            }
        });
    }
}