var coursModel = require('../models/cours');
var utilisateurModel = require('../models/utilisateurs');

var getButtons = function(idUnite, idCours, identifiant, callback) {
    var precedent = "", suivant = "", lu = "";
    // Check if previous button is needed
    coursModel.getPrevious(idUnite, idCours, function(idPrevious, error) {
        if (error == null) {
            if (idPrevious) {
                precedent = "<a class=\"btn btn-outline-secondary\" href=\"/unites/" +
                    idUnite + "/" + idPrevious + "\">" +
                    "        <span class=\"oi oi-chevron-left\"></span>\n" +
                    "        Cours précédent\n" +
                    "    </a>";
            }
            // Check if next button is needed
            coursModel.getNext(idUnite, idCours, function (idNext, error) {
                if (error == null) {
                    if (idNext) {
                        suivant = "<a class=\"btn btn-outline-secondary float-right\" href=\"/unites/" +
                            idUnite + "/" + idNext + "\">" +
                            "        <span class=\"oi oi-chevron-right\"></span>\n" +
                            "        Cours suivant\n" +
                            "    </a>";
                    }
                    // Check if user has read the lesson
                    utilisateurModel.isLessonValidated(idCours, identifiant, function(lessonRead, error) {
                       if (error == null) {
                           if (!lessonRead) {
                               // Check if it's the last lesson of the unit
                               if (suivant != "") {
                                   lu = "<form method=\"POST\">\n" +
                                       "<button type=\"submit\" class=\"btn btn-outline-secondary\">\n" +
                                       "        J'ai lu ce cours, je passe au suivant\n" +
                                       "        <span class=\"oi oi-check\"></span>\n" +
                                       "</button>\n" +
                                       "</form>";
                               }
                               else {
                                   lu = "<form method=\"POST\">\n" +
                                       "<button type=\"submit\" class=\"btn btn-outline-secondary\">\n" +
                                       "        J'ai lu ce cours\n" +
                                       "        <span class=\"oi oi-check\"></span>\n" +
                                       "</button>\n" +
                                       "</form>";
                               }
                           }
                           callback(precedent, suivant, lu);
                       }
                       else {
                           console.log(error);
                       }
                    });
                }
                else {
                    console.log(error);
                }
            });
        }
        else {
            console.log(error);
        }
    });
}

var self = module.exports = {
    run: function (req, res) {
        var idUnite = req.params.idUnite;
        var idCours = req.params.idCours;
        var identifiant = req.user.identifiant;

        // Check if lesson exists
        coursModel.doesLessonExist(idCours, function (exists, error) {
            if (error == null) {
                if (exists) {
                    // get the html for the buttons
                    getButtons(idUnite, idCours, identifiant, function (precedent, suivant, lu) {
                        coursModel.getOrdreFromIdUnite(idUnite, function (ordreUnite, error) {
                            if (error == null) {
                                coursModel.getOrdreFromIdCours(idCours, function (ordreCours, error) {
                                    if (error == null) {
                                        // render the view
                                        res.render('cours.ejs', {
                                            precedent: precedent,
                                            suivant: suivant,
                                            lu: lu,
                                            ordreUnite: ordreUnite,
                                            idUnite: idUnite,
                                            ordreCours: ordreCours
                                        });
                                    }
                                    else {
                                        res.render('error.ejs', {message: error, error: error});
                                    }
                                });
                            }
                            else {
                                res.render('error.ejs', {message: error, error: error});
                            }
                        });
                    });
                }
                else {
                    res.render('404.ejs');
                }
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    },
    validateReadLesson: function(req, res) {
        var idCours = req.params.idCours;
        var idUnite = req.params.idUnite;
        var identifiant = req.user.identifiant;

        utilisateurModel.isLessonValidated(idCours, identifiant, function(booleanValidated, error) {
            if (error == null) {
                if (booleanValidated) {
                    res.render('error.ejs', {message: "Ce cours a déjà été lu par l'utilisateur !", error: "Ce cours a déjà été lu par l'utilisateur !"});
                }
                else {
                    utilisateurModel.validateLesson(idCours, identifiant, function(error) {
                        if (error == null) {
                            // check if it's last lesson of the unit or not
                            coursModel.getNext(idUnite, idCours, function(idNext, error) {
                                if (error == null) {
                                    // not the last lesson of the unit
                                    if (idNext) {
                                        idCours = idNext;
                                    }
                                    req.params.idCours = idCours;
                                    self.run(req, res);
                                }
                                else {
                                    res.render('error.ejs', {message: error, error: error});
                                }
                            });

                        }
                        else {
                            res.render('error.ejs', {message: error, error: error});
                        }
                    })
                }
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        })
    }
}