var administrateursModel = require('../models/administrateurs');
var utilisateursModel = require('../models/utilisateurs');
var coursModel = require('../models/cours');
var challengesModel = require('../models/challenges');
var crypto = require('crypto');

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

module.exports = {
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
                                                                   for (var i = 0; i < dataEverythingCours.length; i++) {
                                                                       menuCoursJson[dataEverythingCours[i].idunite].push({id: dataEverythingCours[i].id, nom: dataEverythingCours[i].nom, difficulte: dataEverythingCours[i].difficulte});
                                                                   }
                                                                   data.menuCoursJson = menuCoursJson;
                                                                   console.log(menuCoursJson);
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
                                                                                         console.log(arrayOrdre);
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
    }
}