var administrateursModel = require('../models/administrateurs');
var utilisateursModel = require('../models/utilisateurs');
var coursModel = require('../models/cours');
var challengesModel = require('../models/challenges');
var crypto = require('crypto');
var async = require('async');
var fs = require('fs');
var config = require('../config/settings').config();

function sha256(password, salt){
    var hash = crypto.createHmac('sha256', salt); /** Hashing algorithm sha256 */
    hash.update(password);
    var value = hash.digest('hex');
    return value;
}

function saltHashPassword(userpassword) {
    var salt = 'saltest';
    var passwordHash = sha256(userpassword, salt);
    return passwordHash;
}

function getCategories(callback) {
    coursModel.getUnitesAll(function(menuUnites, error) {
       if (error == null) {
           callback(menuUnites, null);
       }
       else {
           callback(null, error);
       }
    });
}

function getCours(idUnite, callback) {
    var ordre = 1;
    if (idUnite == null) {
        coursModel.getIdFromOrdreUnite(ordre, function (id, error) {
            if (error == null) {
                coursModel.getMenuCours(id, function (menuCours, error) {
                    if (error == null) {
                        callback(menuCours, null);
                    }
                    else {
                        callback(null, error);
                    }
                });
            }
            else {
                callback(null, error);
            }
        });
    }
    else {
        coursModel.getMenuCours(idUnite, function (menuCours, error) {
            if (error == null) {
                callback(menuCours, null);
            }
            else {
                callback(null, error);
            }
        });
    }
}

function getTexteCours(idCours, callback) {
    fs.readFile('src/public/cours/' + idCours + '.html', function(err, data) {
        console.log(data);
        if (err == null) {
            callback(data, null);
        }
        else {
            callback(null, err);
        }
    });
}

function createFile(idCours, texte, callback) {
    fs.writeFile('src/public/cours/' + idCours + '.html', texte, function (err) {
        if (err == null) {
            callback(null);
        }
        else {
            callback(err);
        }
    });
}

function saveTexteCours(idCours, texte, callback) {
    fs.writeFile('src/public/cours/' + idCours + '.html', texte, function (err) {
        if (err == null) {
            callback(null);
        }
        else {
            callback(err);
        }
    });
}

function deleteTexteCours(idCours, callback) {
    fs.unlink('src/public/cours/' + idCours + '.html', function (err) {
        if (err == null) {
            callback(null);
        }
        else {
            callback(err);
        }
    });
}

function reorderCategories(ordreUniteToAdd, callback) {
    coursModel.getOrderOfUnites(function(data, error) {
        if (error == null) {
            // convert json to array
            var ordreArray = [];
            for (var i = 0; i < data.length; i++) {
                if (ordreUniteToAdd == i+1) {
                    ordreArray.push(0);
                }
                ordreArray.push(data[i].id);
            }
            async.each(ordreArray, function(id, callbackAsync) {
                    if (id > 0) {
                        console.log(id);
                        coursModel.updateOrdreCategories((ordreArray.indexOf(id) + 1), id, function (error) {
                            if (error == null) {
                                callbackAsync();
                            }
                            else {
                                console.log(error);
                                callbackAsync();
                            }
                        });
                    }
                    else {
                        callbackAsync();
                    }
                },
                function(error) {
                    if(error == null) {
                        callback(null);
                    }
                    else {
                        callback(error);
                    }
                });
        }
        else {
            callback(error);
        }
    });
}

function reorderCours(idUnite, ordreCoursToAdd, callback) {
    coursModel.getOrderOfCours(idUnite, function(data, error) {
        if (error == null) {
            // convert json to array
            var ordreArray = [];
            for (var i = 0; i < data.length; i++) {
                if (ordreCoursToAdd == i+1) {
                    ordreArray.push(0);
                }
                ordreArray.push(data[i].id);
            }
            async.each(ordreArray, function(id, callbackAsync) {
                    if (id > 0) {
                        coursModel.updateOrdreCours((ordreArray.indexOf(id) + 1), id, function (error) {
                            if (error == null) {
                                callbackAsync();
                            }
                            else {
                                console.log(error);
                                callbackAsync();
                            }
                        });
                    }
                    else {
                        callbackAsync();
                    }
                },
                function(error) {
                    if(error == null) {
                        callback(null);
                    }
                    else {
                        callback(error);
                    }
                });
        }
        else {
            callback(error);
        }
    });
}

function reorderCategoriesOnUpdate (ordre, idUnite, callback) {
    // Modifier l'ordre des autres catégories si l'ordre de la catégorie a été modifié
    coursModel.getOrdreFromIdUnite(idUnite, function(ordreAvant, error) {
        if (error == null) {
            if (ordreAvant != ordre) {
                // on met à jour l'ordre des catégories :
                coursModel.getOrderOfUnites(function(data, error) {
                    if (error == null) {
                        // convert json to array
                        var ordreArray = [];
                        for (var i = 0; i < data.length; i++) {
                            // Si ce n'est pas la catégorie concernée
                            if (data[i].id != idUnite) {
                                ordreArray.push(data[i].id);
                            }
                        }

                        ordreArray.splice((ordre - 1), 0, parseInt(idUnite));
                        // Endroit à insérer la catégorie
                        //console.log(ordreArray);
                        //console.log(idUnite);
                        async.each(ordreArray, function(id, callbackAsync) {
                                if (id > 0) {
                                    coursModel.updateOrdreCategories((ordreArray.indexOf(id) + 1), id, function (error) {
                                        if (error == null) {
                                            console.log(id);
                                            callbackAsync();
                                        }
                                        else {
                                            console.log(error);
                                            callbackAsync();
                                        }
                                    });
                                }
                                else {
                                    callbackAsync();
                                }
                            },
                            function(error) {
                                if(error == null) {
                                    callback(null);
                                }
                                else {
                                    callback(error);
                                }
                            });
                    }
                    else {
                        callback(error);
                    }
                });
            }
            else {
                callback(null);
            }
        }
        else {
            callback(error);
        }
    });
}

function reorderCoursOnUpdate (ordre, idCours, idUnite, callback) {
    // Modifier l'ordre des autres cours si l'ordre du cours a été modifié
    coursModel.getOrdreFromIdCours(idCours, function(ordreAvant, error) {
        if (error == null) {
            if (ordreAvant != ordre) {
                // on met à jour l'ordre des cours :
                coursModel.getOrderOfCours(idUnite, function(data, error) {
                    if (error == null) {
                        // convert json to array
                        var ordreArray = [];
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].id != idCours) {
                                ordreArray.push(data[i].id);
                            }
                        }
                        // Endroit à insérer la catégorie
                        ordreArray.splice((ordre - 1), 0, parseInt(idCours));

                        for (var i = 0; i < data.length; i++) {
                            console.log(data[i].id);
                        }
                        async.each(ordreArray, function(id, callbackAsync) {
                                if (id > 0) {
                                    coursModel.updateOrdreCours((ordreArray.indexOf(id) + 1), id, function (error) {
                                        if (error == null) {
                                            callbackAsync();
                                        }
                                        else {
                                            console.log(error);
                                            callbackAsync();
                                        }
                                    });
                                }
                                else {
                                    callbackAsync();
                                }
                            },
                            function(error) {
                                if(error == null) {
                                    callback(null);
                                }
                                else {
                                    callback(error);
                                }
                            });
                    }
                    else {
                        callback(error);
                    }
                });
            }
            else {
                callback(null);
            }
        }
        else {
            callback(error);
        }
    });
}

function changeCoursOfUnite (ordre, idCours, idUniteOrigine, idUniteArrivee, callback) {
    // retire le cours de la catégorie précédente
    coursModel.removeCoursFromUnite(idCours, function(error) {
        if (error == null) {
            // reforme bien l'ancienne catégorie
            reorderCours(idUniteOrigine, 0, function(error) {
                if (error == null) {
                    // reformation de la nouvelle catégorie
                    coursModel.getOrderOfCours(idUniteArrivee, function(data, error) {
                        if (error == null) {
                            // convert json to array
                            var ordreArray = [];
                            for (var i = 0; i < data.length; i++) {
                                ordreArray.push(data[i].id);
                            }
                            // Endroit à insérer la catégorie
                            ordreArray.splice((ordre - 1), 0, parseInt(idCours));
                            // Mise à jour de la catégorie du cours
                            coursModel.updateUniteOfCours(idCours, idUniteArrivee, function(error) {
                               if (error == null) {
                                   async.each(ordreArray, function(id, callbackAsync) {
                                           if (id > 0) {
                                               coursModel.updateOrdreCours((ordreArray.indexOf(id) + 1), id, function (error) {
                                                   if (error == null) {
                                                       callbackAsync();
                                                   }
                                                   else {
                                                       console.log(error);
                                                       callbackAsync();
                                                   }
                                               });
                                           }
                                           else {
                                               callbackAsync();
                                           }
                                       },
                                       function(error) {
                                           if(error == null) {
                                               callback(null);
                                           }
                                           else {
                                               callback(error);
                                           }
                                       });
                               }
                               else {
                                   callback(error);
                               }
                            });
                        }
                        else {
                            callback(error);
                        }
                    });
                }
                else {
                    callback(error);
                }
            });
        }
        else {
            callback(error);
        }
    });
}

function reorderCoursGlobal(ordre, idCours, idUniteArrivee, nomCours, difficulte, texteCours, callback) {
    coursModel.getIdUniteFromIdCours(idCours, function (idUniteOrigine, error) {
        if (error == null) {
            coursModel.getOrdreFromIdCours(idCours, function(ordreOrigine, error) {
                if (error == null) {
                    coursModel.updateInfosCours(idCours, nomCours, difficulte, function (error) {
                        if (error == null) {
                            saveTexteCours(idCours, texteCours, function(error) {
                                if (error == null) {
                                    // S'il y a une modification de l'ordre du cours ou un changement de catégorie
                                    if (idUniteArrivee != idUniteOrigine || ordre != ordreOrigine) {
                                        // Si c'est juste un changement d'ordre mais pas de catégorie
                                        if (idUniteArrivee == idUniteOrigine) {
                                            reorderCoursOnUpdate(ordre, idCours, idUniteOrigine, function (error) {
                                                if (error == null) {
                                                    callback(null);
                                                }
                                                else {
                                                    callback(error);
                                                }
                                            });
                                        }
                                        // Si c'est un changement de catégorie
                                        else {
                                            // on supprime le cours de la catégorie
                                            // On réorganise les cours de la catégorie d'origine
                                            changeCoursOfUnite(ordre, idCours, idUniteOrigine, idUniteArrivee, function(error) {
                                               if (error == null) {
                                                   reorderCours(idUniteOrigine, 0, function (error) {
                                                       if (error == null) {
                                                           // Puis on réorganise les cours de la catégorie d'arrivée
                                                           reorderCoursOnUpdate(ordre, idCours, idUniteArrivee, function (error) {
                                                               if (error == null) {
                                                                   callback(null);
                                                               }
                                                               else {
                                                                   callback(error);
                                                               }
                                                           });
                                                       }
                                                   });
                                               }
                                               else {
                                                   callback(error);
                                               }
                                            });
                                        }
                                    }
                                    else {
                                        callback(null);
                                    }
                                }
                                else {
                                    callback(error);
                                }
                            });
                        }
                        else {
                            callback(error);
                        }
                    });
                }
                else {
                    callback(error);
                }
            });
        }
    });
}

var self = module.exports = {
    runConnexion: function (req, res) {
        var identifiant = req.body.identifiantInput;
        var password = req.body.passwordInput;
        if (identifiant != "" && password != "") {
            administrateursModel.userExists(identifiant, function (existsBoolean, error) {
                if (error == null) {
                    if (existsBoolean) {
                        administrateursModel.isPasswordCorrect(identifiant, saltHashPassword(password), function (passwordBoolean, error) {
                            if (error == null) {
                                if (passwordBoolean) {
                                    administrateursModel.updateLastConnection(identifiant, Date.now(), function (error) {
                                        if (error == null) {
                                            req.session.admin = {};
                                            req.session.admin.identifiant = identifiant;
                                            res.redirect('/admin/dashboard/');
                                        }
                                        else {
                                            if (config.mode == 'local') {
                                                res.render('error.ejs', {message: error, error: error});
                                            }
                                            else {
                                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                            }
                                        }
                                    });
                                }
                                else {
                                    administrateursModel.updateLastFailedConnection(identifiant, Date.now(), function (error) {
                                        if (error == null) {
                                            res.render('admin.ejs', {
                                                erreur: "L'identifiant ou le mot de passe sont incorrects.",
                                                identifiant: identifiant
                                            });
                                        }
                                        else {
                                            if (config.mode == 'local') {
                                                res.render('error.ejs', {message: error, error: error});
                                            }
                                            else {
                                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                            }
                                        }
                                    });
                                }
                            }
                            else {
                                if (config.mode == 'local') {
                                    res.render('error.ejs', {message: error, error: error});
                                }
                                else {
                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                }
                            }
                        });
                    }
                    else {
                        res.render('admin.ejs', {
                            erreur: "L'identifiant ou le mot de passe sont incorrects.",
                            identifiant: identifiant
                        });
                    }
                }
                else {
                    if (config.mode == 'local') {
                        res.render('error.ejs', {message: error, error: error});
                    }
                    else {
                        res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                    }
                }
            });
        }
        else {
            res.render('admin.ejs', {
                erreur: "Veuillez remplir tous les champs !",
                identifiant: identifiant
            });
        }
    },
    runSuivi: function (req, res) {
        utilisateursModel.getNumberOfUsers(function (numberOfUsers, error) {
            if (error == null) {
                var data = {numberOfUsers: numberOfUsers};
                coursModel.getNumberOfCours(function (numberOfCours, error) {
                    if (error == null) {
                        data.numberOfCours = numberOfCours;
                        challengesModel.getNumberOfChallenges(function (numberOfChallenges, error) {
                            if (error == null) {
                                data.numberOfChallenges = numberOfChallenges;
                                coursModel.getNumberOfUnites(function (numberOfUnites, error) {
                                    if (error == null) {
                                        data.numberOfUnites = numberOfUnites;
                                        challengesModel.getMenu(function (menuChallenges, error) {
                                            if (error == null) {
                                                data.menuChallenges = menuChallenges;
                                                challengesModel.getNombreValidations(function (nombreValidationsArray, error) {
                                                    if (error == null) {
                                                        var jsonNombreValidations = {};
                                                        for (var i = 0; i < nombreValidationsArray.length; i++) {
                                                            jsonNombreValidations[nombreValidationsArray[i].idchallenge] = nombreValidationsArray[i].count;
                                                        }
                                                        data.jsonNombreValidations = jsonNombreValidations;
                                                        coursModel.getEverythingCours(function (dataEverythingCours, error) {
                                                            if (error == null) {
                                                                coursModel.getUnites(function (menuUnites, error) {
                                                                    if (error == null) {
                                                                        var menuCoursJson = {};
                                                                        // Pas sûr que cette initialisation soit nécessaire
                                                                        for (var i = 0; i < menuUnites.length; i++) {
                                                                            menuCoursJson[menuUnites[i].id] = [];
                                                                        }
                                                                        console.log(menuCoursJson);
                                                                        console.log(dataEverythingCours);
                                                                        for (var i = 0; i < dataEverythingCours.length; i++) {
                                                                            if (dataEverythingCours[i].idunite) {
                                                                                menuCoursJson[dataEverythingCours[i].idunite].push({
                                                                                    id: dataEverythingCours[i].id,
                                                                                    nom: dataEverythingCours[i].nom,
                                                                                    difficulte: dataEverythingCours[i].difficulte
                                                                                });
                                                                            }
                                                                        }
                                                                        data.menuCoursJson = menuCoursJson;
                                                                        coursModel.getNombreValidations(function (nombreValidationsCours, error) {
                                                                            if (error == null) {
                                                                                var jsonNombreValidationsCours = {};
                                                                                for (var i = 0; i < nombreValidationsCours.length; i++) {
                                                                                    jsonNombreValidationsCours[nombreValidationsCours[i].idcours] = nombreValidationsCours[i].count;
                                                                                }
                                                                                data.jsonNombreValidationsCours = jsonNombreValidationsCours;
                                                                                coursModel.getNomOfUnites(function (nomOfUnites, error) {
                                                                                    if (error == null) {
                                                                                        var jsonNomOfUnites = {};
                                                                                        for (var i = 0; i < nomOfUnites.length; i++) {
                                                                                            jsonNomOfUnites[nomOfUnites[i].id] = nomOfUnites[i].nom;
                                                                                        }
                                                                                        data.nomOfUnites = jsonNomOfUnites;
                                                                                        coursModel.getOrderOfUnites(function (ordreUnites, error) {
                                                                                            if (error == null) {
                                                                                                var arrayOrdre = [];
                                                                                                for (var i = 0; i < ordreUnites.length; i++) {
                                                                                                    arrayOrdre[i] = ordreUnites[i].id;
                                                                                                }
                                                                                                data.arrayOrdre = arrayOrdre;
                                                                                                res.render('suivi.ejs', data);
                                                                                            }
                                                                                            else {
                                                                                                if (config.mode == 'local') {
                                                                                                    res.render('error.ejs', {message: error, error: error});
                                                                                                }
                                                                                                else {
                                                                                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                                                                }
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                    else {
                                                                                        if (config.mode == 'local') {
                                                                                            res.render('error.ejs', {message: error, error: error});
                                                                                        }
                                                                                        else {
                                                                                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                            else {
                                                                                if (config.mode == 'local') {
                                                                                    res.render('error.ejs', {message: error, error: error});
                                                                                }
                                                                                else {
                                                                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                    else {
                                                                        if (config.mode == 'local') {
                                                                            res.render('error.ejs', {message: error, error: error});
                                                                        }
                                                                        else {
                                                                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                if (config.mode == 'local') {
                                                                    res.render('error.ejs', {message: error, error: error});
                                                                }
                                                                else {
                                                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                                }
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        if (config.mode == 'local') {
                                                            res.render('error.ejs', {message: error, error: error});
                                                        }
                                                        else {
                                                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                        }
                                                    }
                                                });
                                            }
                                            else {
                                                if (config.mode == 'local') {
                                                    res.render('error.ejs', {message: error, error: error});
                                                }
                                                else {
                                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        if (config.mode == 'local') {
                                            res.render('error.ejs', {message: error, error: error});
                                        }
                                        else {
                                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                        }
                                    }
                                })
                            }
                            else {
                                if (config.mode == 'local') {
                                    res.render('error.ejs', {message: error, error: error});
                                }
                                else {
                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                }
                            }
                        })
                    }
                    else {
                        if (config.mode == 'local') {
                            res.render('error.ejs', {message: error, error: error});
                        }
                        else {
                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                        }
                    }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    runDashboard: function (req, res) {
        var data = {};
        getCategories(function (dataCategories, error) {
            if (error == null) {
                if (dataCategories.length > 0) {
                    getCours(null, function (dataCours, error) {
                        if (error == null) {
                            data.dataCategories = dataCategories;
                            data.dataCours = dataCours;
                            res.render('dashboard.ejs', data);
                        }
                        else {
                            if (config.mode == 'local') {
                                res.render('error.ejs', {message: error, error: error});
                            }
                            else {
                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                            }
                        }
                    });
                }
                else {
                    res.render('dashboard.ejs');
                }
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    runDashboardUnite: function (req, res) {
        var idUnite = req.params.idUnite;
        var data = {};
        getCategories(function (dataCategories, error) {
            if (error == null) {
                getCours(idUnite, function (dataCours, error) {
                    if (error == null) {
                        data.dataCategories = dataCategories;
                        data.dataCours = dataCours;
                        data.idUnite = idUnite;
                        res.render('dashboard.ejs', data);
                    }
                    else {
                        if (config.mode == 'local') {
                            res.render('error.ejs', {message: error, error: error});
                        }
                        else {
                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                        }
                    }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    saveDashboard: function (req, res) {
        // update infos
        self.runDashboard(req, res);
    },
    updateCategories: function (req, res) {
        var data = JSON.parse(req.body.json);
        async.forEachOf(data, function (item, key, callback) {
                coursModel.updateCategories(key, item[0], item[1], function (error) {
                    if (error == null) {
                        callback();
                    }
                    else {
                        console.log(error);
                    }
                });
            },
            function (error) {
                // All tasks are done now
                if (error == null) {
                    res.status(200).json({});
                }
                else {
                    res.status(500).send(error);
                }

            }
        );
    },
    deleteCategorie: function (req, res) {
        var idUnite = req.params.idUnite;
        console.log(idUnite);
        coursModel.deleteCategorie(idUnite, function (error) {
            if (error == null) {
                reorderCategories(0, function (error) {
                    if (error == null) {
                        res.redirect('/admin/dashboard');
                    }
                    else {
                        if (config.mode == 'local') {
                            res.render('error.ejs', {message: error, error: error});
                        }
                        else {
                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                        }
                    }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    runCategorie: function (req, res) {
        var idUnite = req.params.idUnite;
        coursModel.getNumberOfUnites(function (numberOfUnites, error) {
            if (error == null) {
                // Si on modifie une catégorie déjà existante
                if (idUnite != null) {
                    coursModel.getAllOfOneUnite(idUnite, function (data, error) {
                        if (error == null) {
                            console.log(data);
                            res.render('formCategorie.ejs', {
                                numberOfUnites: numberOfUnites - 1,
                                nom: data.nom,
                                ordre: data.ordre,
                                description: data.description
                            });
                        }
                        else {
                            if (config.mode == 'local') {
                                res.render('error.ejs', {message: error, error: error});
                            }
                            else {
                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                            }
                        }
                    });
                }
                // Si on ajoute une catégorie
                else {
                    res.render('formCategorie.ejs', {numberOfUnites: numberOfUnites});
                }
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    addCategorie: function (req, res) {
        var nomUnite = req.body.titleInput;
        var descriptionUnite = req.body.descriptionInput;
        var ordreInput = req.body.ordreInput;
        var ordre;
        if (nomUnite != "" && descriptionUnite != "") {
            if (typeof ordreInput == "string") {
                ordre = parseInt(ordreInput);
            }
            else {
                ordre = 1;
            }
            // re-order categories
            reorderCategories(ordre, function (error) {
                if (error == null) {
                    coursModel.addCategorie(nomUnite, descriptionUnite, ordre, function (idUnite, error) {
                        if (error == null) {
                            res.redirect('/admin/dashboard');
                        }
                        else {
                            if (config.mode == 'local') {
                                res.render('error.ejs', {message: error, error: error});
                            }
                            else {
                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                            }
                        }
                    });
                }
                else {
                    if (config.mode == 'local') {
                        res.render('error.ejs', {message: error, error: error});
                    }
                    else {
                        res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                    }
                }
            });
        }
    },
    saveModifiedCategorie: function (req, res) {
        var nomUnite = req.body.titleInput;
        var descriptionUnite = req.body.descriptionInput;
        var ordreInput = req.body.ordreInput;
        var idUnite = req.params.idUnite;
        var ordre = 1;
        if (nomUnite != "" && descriptionUnite != "" && ordreInput != "") {
            if (typeof ordreInput != "undefined") {
                ordre = parseInt(ordreInput);
            }
            // Attention : avant de supprimer la catégorie, il faut sauvegarder les ids des cours qui sont attachés à cette catégorie
            // et ensuite les remettre à jour avec le même id de cours
            reorderCategoriesOnUpdate(ordre, idUnite, function(error) {
                if (error == null) {
                    // on met à jour la catégorie
                    coursModel.updateInfosCategorie(idUnite, nomUnite, descriptionUnite, function(error) {
                        if (error == null) {
                            res.redirect('/admin/dashboard/');
                        }
                        else {
                            if (config.mode == 'local') {
                                res.render('error.ejs', {message: error, error: error});
                            }
                            else {
                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                            }
                        }
                    });
                }
                else {
                    if (config.mode == 'local') {
                        res.render('error.ejs', {message: error, error: error});
                    }
                    else {
                        res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                    }
                }
            });
        }
    },
    getCoursFromCategorie: function (req, res) {
        var idUnite = req.body.idUnite;
        if (idUnite != null) {
            coursModel.getMenuCours(idUnite, function (data, error) {
                if (error == null) {
                    res.status(200).send(data);
                }
                else {
                    console.log("Erreur : " + error);
                    res.status(500).send(error);
                }
            });
        }
    },
    runCours: function (req, res) {
        var idUnite = req.params.idUnite;
        coursModel.getNumberOfCoursInUnite(idUnite, function (numberOfCours, error) {
            if (error == null) {
                getCategories(function (dataCategories, error) {
                    if (error == null) {
                        res.render('formCours.ejs', {
                            numberOfCours: numberOfCours,
                            dataCategories: dataCategories,
                            idUnite: idUnite
                        });
                    }
                    else {
                        if (config.mode == 'local') {
                            res.render('error.ejs', {message: error, error: error});
                        }
                        else {
                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                        }
                    }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    editCours: function (req, res) {
        var idCours = req.params.idCours;
        coursModel.getIdUniteFromIdCours(idCours, function (idUnite, error) {
            if (error == null) {
                coursModel.getNumberOfCoursInUnite(idUnite, function (numberOfCours, error) {
                    if (error == null) {
                        getCategories(function (dataCategories, error) {
                            if (error == null) {
                                coursModel.getEverythingCoursWithId(idCours, function (dataCours, error) {
                                    if (error == null) {
                                        // récupère le texte du cours
                                        getTexteCours(idCours, function (texte, error) {
                                            if (error == null) {
                                                res.render('formCours.ejs', {
                                                    numberOfCours: numberOfCours - 1,
                                                    dataCategories: dataCategories,
                                                    idUnite: idUnite,
                                                    nom: dataCours.nom,
                                                    ordre: dataCours.ordre,
                                                    difficulte: dataCours.difficulte,
                                                    idCours: dataCours.id,
                                                    texteCours: texte
                                                });
                                            }
                                            else {
                                                if (config.mode == 'local') {
                                                    res.render('error.ejs', {message: error, error: error});
                                                }
                                                else {
                                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        if (config.mode == 'local') {
                                            res.render('error.ejs', {message: error, error: error});
                                        }
                                        else {
                                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                        }
                                    }
                                });
                            }
                            else {
                                if (config.mode == 'local') {
                                    res.render('error.ejs', {message: error, error: error});
                                }
                                else {
                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                }
                            }
                        });
                    }
                    else {
                        if (config.mode == 'local') {
                            res.render('error.ejs', {message: error, error: error});
                        }
                        else {
                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                        }
                    }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    },
    saveModifiedCours: function (req, res) {
        var nomCours = req.body.titleInput;
        var ordreInput = req.body.ordreInput;
        var idCours = parseInt(req.params.idCours);
        var difficulteInput = req.body.difficulteCoursInput;
        var idUniteArrivee = parseInt(req.body.nomCategorieInput);
        var ordre = 1;
        var texteCours = req.body.texteInput;

        if (nomCours != "" && difficulteInput != "") {
            if (typeof ordreInput != "undefined") {
                ordre = parseInt(ordreInput);
            }
            var difficulte = parseInt(difficulteInput);
            // reorder cours
            reorderCoursGlobal(ordre, idCours, idUniteArrivee, nomCours, difficulte, texteCours, function(error) {
               if (error == null) {
                   res.redirect('/admin/dashboard/' + idUniteArrivee);
               }
               else {
                   if (config.mode == 'local') {
                       res.render('error.ejs', {message: error, error: error});
                   }
                   else {
                       res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                   }
               }
            });
        }
    },
    getSelectOrdreFromCategorie: function (req, res) {
        var idUnite = req.params.idUnite;
        coursModel.getNumberOfCoursInUnite(idUnite, function (numberOfCours, error) {
            if (error == null) {
                res.status(200).send(numberOfCours);
            }
            else {
                res.status(500).send(error);
            }
        });
    },
    addCours: function (req, res) {
        var nomCours = req.body.titleInput;
        var ordreInput = req.body.ordreInput;
        var difficulteInput = req.body.difficulteCoursInput;
        var idUnite = req.body.nomCategorieInput;
        var ordre = 1;
        var difficulte = 0;
        var texteCours = req.body.texteInput;
        if (nomCours != "") {
            if (typeof ordreInput != "undefined") {
                ordre = parseInt(ordreInput);
            }
            if (typeof difficulteInput != "undefined") {
                difficulte = parseInt(difficulteInput);
            }

            if (typeof texteCours == "undefined") {
                texteCours = "";
            }
            // re-order cours
            reorderCours(idUnite, ordre, function (error) {
                if (error == null) {
                    coursModel.addCours(nomCours, ordre, idUnite, difficulte, function (id, error) {
                        if (error == null) {
                            // Création d'un fichier pour le texte du cours
                            createFile(id, texteCours, function (error) {
                                if (error == null) {
                                    res.redirect('/admin/dashboard/' + idUnite);
                                }
                                else {
                                    if (config.mode == 'local') {
                                        res.render('error.ejs', {message: error, error: error});
                                    }
                                    else {
                                        res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                    }
                                }
                            });
                        }
                        else {
                            if (config.mode == 'local') {
                                res.render('error.ejs', {message: error, error: error});
                            }
                            else {
                                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                            }
                        }
                    });
                }
                else {
                    if (config.mode == 'local') {
                        res.render('error.ejs', {message: error, error: error});
                    }
                    else {
                        res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                    }
                }
            });
        }
        // modifier ça pour bien gérer l'erreur
        else {
            if (config.mode == 'local') {
                res.render('error.ejs', {message: error, error: error});
            }
            else {
                res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
            }
        }
    },
    updateCours: function (req, res) {
        var data = JSON.parse(req.body.json);
        async.forEachOf(data, function (item, key, callback) {
                coursModel.updateCours(key, item[0], item[1], function (error) {
                    if (error == null) {
                        callback();
                    }
                    else {
                        console.log(error);
                    }
                });
            },
            function (error) {
                // All tasks are done now
                if (error == null) {
                    res.status(200).json({});
                }
                else {
                    res.status(500).send(error);
                }
            }
        );
    },
    deleteCours: function (req, res) {
        var idUnite = req.params.idUnite;
        var idCours = req.params.idCours;
        deleteTexteCours(idCours, function (error) {
            if (error == null) {
                coursModel.deleteCours(idCours, function (error) {
                    if (error == null) {
                        reorderCours(idUnite, 0, function (error) {
                            if (error == null) {
                                var idUniteInt = parseInt(idUnite);
                                res.redirect('/admin/dashboard/' + idUniteInt);
                            }
                            else {
                                if (config.mode == 'local') {
                                    res.render('error.ejs', {message: error, error: error});
                                }
                                else {
                                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                                }
                            }
                        });
                    }
                    else {
                        if (config.mode == 'local') {
                            res.render('error.ejs', {message: error, error: error});
                        }
                        else {
                            res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                        }
                    }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    }
}