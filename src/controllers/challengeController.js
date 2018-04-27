var challengesModel = require('../models/challenges');
var utilisateurModel = require('../models/utilisateurs');
var config = require('../config/settings').config();

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

module.exports = {
    run: function (req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        challengesModel.getOrdreFromId(idChallenge, function(ordreChallenge, error) {
            if (error == null) {
                utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
                   if (error == null) {
                       challengesModel.getIndiceChallenge(idChallenge, function(indice, error) {
                           if (error == null) {
                               res.render('challenge.ejs', {idChallenge: idChallenge, ordreChallenge: ordreChallenge, host: config.hostURLChallenges, validate: validatedBoolean, indice: indice});
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
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    },
    checkFlagAndInsert: function(req, res) {
        var flag = req.body.flag;
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        challengesModel.validateFlag(idChallenge, flag, function (flagBoolean, error) {
            if (error == null) {
                if (flagBoolean) {
                    // Le flag est le bon, on vérifie si c'est la première fois que l'utilisateur le valide, si oui on dit que l'utilisateur l'a validé à la bdd
                    utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
                        if (error == null) {
                            if (validatedBoolean) {
                                res.status(200).json({
                                    flag: true
                                });
                            }
                            else {
                                utilisateurModel.validateChallenge(identifiant, idChallenge, function(error) {
                                    if (error == null) {
                                        res.status(200).json({
                                            flag: true
                                        });
                                    }
                                    else {
                                        console.log("Erreur : " + error);
                                        res.status(500).send(error);
                                    }
                                })
                            }
                        }
                        else {
                            console.log("Erreur : " + error);
                            res.status(500).send(error);
                        }
                    });
                }
                else {
                    res.status(200).json({
                        flag: false
                    });
                }
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        });
    },
    isChallengeValidated: function(req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
            if (error == null) {
                if (validatedBoolean) {
                    res.status(200).json({
                        challengeValidated: true
                    });
                }
                else {
                    res.status(200).json({
                        challengeValidated: false
                    });
                }
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        })
    },
    getSolutionsOfChallenge: function(req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
            if (error == null) {
                if (validatedBoolean) {
                    challengesModel.getSolutionsOfChallenge(idChallenge, function(data, error) {
                        if (error == null) {
                            // Mise en forme de la solution
                            var solution = "<div class=\"card\">\n" +
                                "  <div class=\"card-body\">\n";

                            solution += escapeHtml(data[0].solution);
                            solution += "  </div>\n" +
                                "</div><br>";
                            for (var i = 0; i < data[1].length; i++) {
                                solution += "<div class=\"card\">\n" +
                                    "  <div class=\"card-body\">\n";
                                solution += escapeHtml(data[1][i].identifiant + ' propose : ');
                                solution += '<br>';
                                solution += escapeHtml(data[1][i].solution);
                                solution += "  </div>\n" +
                                    "</div>";
                                solution += '<br>';
                            }
                            res.status(200).send(solution);
                        }
                        else {
                            console.log("Erreur : " + error);
                            res.status(500).send(error);
                        }
                    });
                }
                else {
                    res.status(200).json({
                        erreur: "Il faut d'abord valider le challenge pour avoir accès à la solution !"
                    });
                }
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        })
    },
    proposeSolution : function(req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        var solution = escapeHtml(req.body.solution);
        if (solution != "") {
            utilisateurModel.isChallengeValidated(identifiant, idChallenge, function (validatedBoolean, error) {
                if (error == null) {
                    if (validatedBoolean) {
                        utilisateurModel.setSolutionChallenge(identifiant, idChallenge, solution, function (error) {
                            if (error == null) {
                                res.status(200).json({});
                            }
                            else {
                                console.log("Erreur : " + error);
                                res.status(500).send(error);
                            }
                        });
                    }
                }
                else {
                    console.log("Erreur : " + error);
                    res.status(500).send(error);
                }
            });
        }
        else {
            console.log("Solution vide");
            res.status(500).send(error);
        }
    }
}