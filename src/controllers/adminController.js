var administrateursModel = require('../models/administrateurs');
var utilisateursModel = require('../models/utilisateurs');
var coursModel = require('../models/cours');
var challengesModel = require('../models/challenges');
var crypto = require('crypto');
var async = require('async');

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
            console.log(ordreArray);
            async.each(ordreArray, function(id, callbackAsync) {
                    if (id > 0) {
                        console.log(id);
                        coursModel.updateOrdreCategories((ordreArray.indexOf(id) + 1), id, function (error) {
                            if (error == null) {
                                console.log("null");
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
                    console.log("Done");
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

var self = module.exports = {
    runConnexion: function(req, res) {
        var identifiant = req.body.identifiantInput;
        var password = req.body.passwordInput;
        if (identifiant != "" && password != "") {
            administrateursModel.userExists(identifiant, function(existsBoolean, error) {
                if (error == null) {
                    if (existsBoolean) {
                        administrateursModel.isPasswordCorrect(identifiant, saltHashPassword(password), function(passwordBoolean, error) {
                            if (error == null) {
                                if (passwordBoolean) {
                                    administrateursModel.updateLastConnection(identifiant, Date.now(), function(error) {
                                        if (error == null) {
                                            req.session.admin = {};
                                            req.session.admin.identifiant = identifiant;
                                            res.redirect('/admin/dashboard/');
                                        }
                                        else {
                                            res.render('error.ejs', {message: error, error: error});
                                        }
                                    });
                                }
                                else {
                                    administrateursModel.updateLastFailedConnection(identifiant, Date.now(), function(error) {
                                        if (error == null) {
                                            res.render('admin.ejs', {erreur: "L'identifiant ou le mot de passe sont incorrects.", identifiant: identifiant});
                                        }
                                        else {
                                            res.render('error.ejs', {message: error, error: error});
                                        }
                                    });
                                }
                            }
                            else {
                                res.render('error.ejs', {message: error, error: error});
                            }
                        });
                    }
                    else {
                        res.render('admin.ejs', {erreur: "L'identifiant ou le mot de passe sont incorrects.", identifiant: identifiant});
                    }
                }
                else {
                    res.render('error.ejs', {message: error, error: error});
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
    runSuivi: function(req, res) {
        utilisateursModel.getNumberOfUsers(function(numberOfUsers, error) {
           if (error == null) {
               var data = {numberOfUsers: numberOfUsers};
               coursModel.getNumberOfCours(function(numberOfCours, error) {
                  if (error == null) {
                      data.numberOfCours = numberOfCours;
                      challengesModel.getNumberOfChallenges(function(numberOfChallenges, error) {
                          if (error == null) {
                              data.numberOfChallenges = numberOfChallenges;
                              coursModel.getNumberOfUnites(function(numberOfUnites, error) {
                                  if (error == null) {
                                      data.numberOfUnites = numberOfUnites;
                                      challengesModel.getMenu(function(menuChallenges, error) {
                                         if (error == null) {
                                             data.menuChallenges = menuChallenges;
                                             challengesModel.getNombreValidations(function(nombreValidationsArray, error) {
                                                 if (error == null) {
                                                     var jsonNombreValidations = {};
                                                     for (var i = 0; i < nombreValidationsArray.length; i++) {
                                                         jsonNombreValidations[nombreValidationsArray[i].idchallenge] = nombreValidationsArray[i].count;
                                                     }
                                                     data.jsonNombreValidations = jsonNombreValidations;
                                                     coursModel.getEverythingCours(function(dataEverythingCours, error) {
                                                        if (error == null) {
                                                            coursModel.getUnites(function(menuUnites, error) {
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
                                                                   coursModel.getNombreValidations(function(nombreValidationsCours, error) {
                                                                      if (error == null) {
                                                                          var jsonNombreValidationsCours = {};
                                                                          for (var i = 0; i < nombreValidationsCours.length; i++) {
                                                                              jsonNombreValidationsCours[nombreValidationsCours[i].idcours] = nombreValidationsCours[i].count;
                                                                          }
                                                                          data.jsonNombreValidationsCours = jsonNombreValidationsCours;
                                                                          coursModel.getNomOfUnites(function(nomOfUnites, error) {
                                                                              if (error == null) {
                                                                                  var jsonNomOfUnites = {};
                                                                                  for (var i = 0; i < nomOfUnites.length; i++) {
                                                                                      jsonNomOfUnites[nomOfUnites[i].id] = nomOfUnites[i].nom;
                                                                                  }
                                                                                  data.nomOfUnites = jsonNomOfUnites;
                                                                                  coursModel.getOrderOfUnites(function(ordreUnites, error) {
                                                                                     if (error == null) {
                                                                                         var arrayOrdre = [];
                                                                                         for (var i = 0; i < ordreUnites.length; i++) {
                                                                                             arrayOrdre[i] = ordreUnites[i].id;
                                                                                         }
                                                                                         data.arrayOrdre = arrayOrdre;
                                                                                         res.render('suivi.ejs', data);
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
                          else {
                              res.render('error.ejs', {message: error, error: error});
                          }
                      })
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
    runDashboard: function(req, res) {
        var data = {};
        getCategories(function(dataCategories, error) {
            if (error == null) {
                data.dataCategories = dataCategories;
                res.render('dashboard.ejs', data);
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    },
    saveDashboard: function(req, res) {
        // update infos
        self.runDashboard(req, res);
    },
    updateCategories: function(req, res) {
        var data = JSON.parse(req.body.json);
        async.forEachOf(data, function(item, key, callback) {
                coursModel.updateCategories(key, item[0], item[1], function(error) {
                    if (error == null) {
                        callback();
                    }
                    else {
                        console.log(error);
                    }
                });
            },
            function(error){
                // All tasks are done now
                if(error == null) {
                    res.status(200).json({});
                }
                else {
                    res.status(500).send(error);
                }

            }
        );
    },
    deleteCategorie: function(req, res) {
        var idUnite = req.params.idUnite;
        console.log(idUnite);
        coursModel.deleteCategorie(idUnite, function(error) {
           if (error == null) {
               reorderCategories(0, function(error) {
                   if (error == null) {
                       res.redirect('/admin/dashboard');
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
    runCategorie: function(req, res) {
        var idUnite = req.params.idUnite;
        coursModel.getNumberOfUnites(function(numberOfUnites, error) {
           if (error == null) {
               if (idUnite != null) {
                   coursModel.getAllOfOneUnite(idUnite, function(data, error) {
                       if (error == null) {
                           console.log(data);
                           res.render('ajoutCategorie.ejs', {numberOfUnites: numberOfUnites - 1, nom: data.nom, ordre: data.ordre, description: data.description});
                       }
                       else {
                           res.render('error.ejs', {message: error, error: error});
                       }
                   });
               }
               else {
                   res.render('ajoutCategorie.ejs', {numberOfUnites: numberOfUnites});
               }
           }
           else {
               res.render('error.ejs', {message: error, error: error});
           }
        });
    },
    addCategorie: function(req, res) {
        var nomUnite = req.body.titleInput;
        var descriptionUnite = req.body.descriptionInput;
        var ordreInput = req.body.ordreInput;

        if (nomUnite != "" && descriptionUnite != "" && ordreInput != "") {
            var ordre = parseInt(ordreInput);
            // re-order categories
            reorderCategories(ordre, function (error) {
                if (error == null) {
                    coursModel.addCategorie(nomUnite, descriptionUnite, ordre, function (error) {
                        if (error == null) {
                            res.redirect('/admin/dashboard');
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
    },
    modifyCategorie: function(req, res) {
        var nomUnite = req.body.titleInput;
        var descriptionUnite = req.body.descriptionInput;
        var ordreInput = req.body.ordreInput;
        var idUnite = req.params.idUnite;

        if (nomUnite != "" && descriptionUnite != "" && ordreInput != "") {
            var ordre = parseInt(ordreInput);
            coursModel.deleteCategorie(idUnite, function (error) {
                if (error == null) {
                    reorderCategories(ordre, function (error) {
                        if (error == null) {
                            coursModel.addCategorie(nomUnite, descriptionUnite, ordre, function (error) {
                                if (error == null) {
                                    res.redirect('/admin/dashboard');
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
        }
    }
}