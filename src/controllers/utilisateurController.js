var utilisateursModel = require('../models/utilisateurs');
var crypto = require('crypto');
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

function resetPassword(res, email) {
    // Génération token + date expiration
    crypto.randomBytes(20, function(err, buffer) {
        var token = buffer.toString('hex');
        console.log(token);
        // Ajout d'une heure
        var expiryDate = Date.now() + 1000*(3600);
        // Insertion BDD
        utilisateursModel.setToken(token, expiryDate, email, function(error) {
            if (error == null) {
                // ENVOI EMAIL AVEC LIEN
                // Affichage nouvelle vue
                res.redirect('/connexion?message=1');
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
    });
}

module.exports = {
    runInscription: function (req, res) {
        var identifiant = req.body.identifiantInput;
        var email = req.body.emailInput;
        var password = req.body.passwordInput;

        if (identifiant != "" && email != "" && password != "") {
            utilisateursModel.isEmailAvailable(email, function (emailBoolean, error) {
                if (error == null) {
                    if (emailBoolean) {
                        utilisateursModel.isIdentifiantAvailable(identifiant, function (identifiantBoolean, error) {
                            if (error == null) {
                                if (identifiantBoolean) {
                                    utilisateursModel.inscription(email, identifiant, saltHashPassword(password), function (error) {
                                        if (error == null) {
                                            req.session.user = {};
                                            req.session.user.identifiant = identifiant;
                                            req.session.user.email = email;
                                            res.redirect('/?inscription=ok');
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
                                    res.render('inscription.ejs', {erreur: "Cet identifiant est déjà utilisé par un autre utilisateur.", identifiant: identifiant, email: email});
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
                        })
                    }
                    else {
                        res.render('inscription.ejs', {erreur: "Cet email est déjà utilisé par un autre utilisateur.", identifiant: identifiant, email: email});
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
            res.render('inscription.ejs', {erreur: "Veuillez remplir tous les champs !", identifiant: identifiant, email: email});
        }
    },
    runConnexion: function(req, res) {
        var identifiant = req.body.identifiantInput;
        var password = req.body.passwordInput;
        if (identifiant != "" && password != "") {
            utilisateursModel.userExists(identifiant, function(existsBoolean, error) {
               if (error == null) {
                   if (existsBoolean) {
                       utilisateursModel.isPasswordCorrect(identifiant, saltHashPassword(password), function(passwordBoolean, error) {
                           if (error == null) {
                               if (passwordBoolean) {
                                   utilisateursModel.updateLastConnection(identifiant, Date.now(), function(error) {
                                       if (error == null) {
                                           req.session.user = {};
                                           req.session.user.identifiant = identifiant;
                                           utilisateursModel.getEmail(identifiant, function(email, error) {
                                               if (error == null) {
                                                   req.session.user.email = email;
                                                   res.redirect('/?connexion=ok');
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
                                   utilisateursModel.updateLastFailedConnection(identifiant, Date.now(), function(error) {
                                       if (error == null) {
                                           res.render('connexion.ejs', {erreur: "L'identifiant ou le mot de passe sont incorrects.", identifiant: identifiant});
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
                       res.render('connexion.ejs', {erreur: "L'identifiant ou le mot de passe sont incorrects.", identifiant: identifiant});
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
            res.render('connexion.ejs', {
                erreur: "Veuillez remplir tous les champs !",
                identifiant: identifiant
            });
        }
    },
    runProfil: function(req, res) {
        var identifiant = req.user.identifiant;
        var message = req.query.message;
        utilisateursModel.getPourcentageOfCoursLus(identifiant, function(pourcentCoursLus, error) {
            if (error == null) {
                utilisateursModel.getPourcentageOfValidatedChallenges(identifiant, function(pourcentChallengesReussis, error) {
                    if (error == null) {
                        utilisateursModel.hasCertificate(identifiant, function (booleanCertificate, error) {
                            if (error == null) {
                                utilisateursModel.getDateInscription(identifiant, function(date, error) {
                                   if (error == null) {
                                       var theDate = new Date(parseInt(date));
                                       var day = theDate.getDay();
                                       var month = theDate.getMonth();
                                       var year = theDate.getFullYear();
                                       if (day < 10) {
                                           day = '0' + day;
                                       }
                                       if(month < 10) {
                                           month = '0' + month;
                                       }
                                       var date = day + '/' + month + '/' + year;
                                       var dateInscription = date;
                                       var argumentProfil = {
                                           email: req.user.email,
                                           identifiant: req.user.identifiant,
                                           dateInscription: dateInscription,
                                           pourcentCoursLus: pourcentCoursLus,
                                           pourcentChallengesReussis: pourcentChallengesReussis,
                                           booleanCertificate: booleanCertificate };
                                       if (message == 1) {
                                           argumentProfil['message'] = "Votre mot de passe a bien été changé.";
                                       }
                                       res.render('profil.ejs', argumentProfil);
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
    },
    changeMDP: function(req, res) {
        var ancienMDP = req.body.ancienMDP;
        var nouveauMDP = req.body.nouveauMDP;

        if (ancienMDP != "" && nouveauMDP != ""){
            utilisateursModel.isPasswordCorrect(req.user.identifiant, saltHashPassword(ancienMDP), function(booleanPass, error) {
                if (error == null) {
                    if (booleanPass) {
                        utilisateursModel.changeMDP(req.user.identifiant, saltHashPassword(nouveauMDP), function (error) {
                            if (error == null) {
                                res.redirect('/profil?message=1');
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
                        res.render('profil.ejs', {erreur: "L'ancien mot de passe n'est pas valide.", email: req.user.email, identifiant: req.user.identifiant});
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
            })
        }
        else {
            res.render('profil.ejs', {
                erreur: "Veuillez remplir tous les champs !", email: req.user.email, identifiant: req.user.identifiant
            });
        }
    },
    reinitialiseMDP: function(req, res) {
        var email = req.body.emailInput;
        if (email != "") {
            utilisateursModel.emailExists(email, function (existsBoolean, error) {
                if (error == null) {
                    if (existsBoolean) {
                        resetPassword(res, email);
                    }
                    else {
                        res.render('motDePasseOublie.ejs', {
                            erreur: "L'adresse email n'est pas enregistrée dans notre base de données, essayez avec une autre adresse mail.",
                            email: email
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
            res.render('motDePasseOublie.ejs', {
                erreur: "Veuillez remplir tous les champs !",
                email: email
            });
        }
    },
    verifieToken: function(req, res) {
        var token = req.query.token;
        var email = req.query.email;
        utilisateursModel.checkToken(token, email, function(checkBoolean, error) {
           if (error == null) {
               // Le token est valide
               if (checkBoolean) {
                   res.render('reinitialiseMDP.ejs', {email: email});
               }
               // Le token n'est pas valide ou la date a expiré ou l'email n'est pas bon
               else {
                   res.render('reinitialiseMDP.ejs', {message: 'Il y a eu un problème pour la réinitialisation de votre mot de passe, merci de refaire la procédure de réinitialisation pour accéder à votre compte.'});
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
    setNouveauMDP: function(req, res) {
        var token = req.query.token;
        var email = req.query.email;
        var mdp = req.body.resetMDP;
        utilisateursModel.checkToken(token, email, function (checkBoolean, error) {
            if (error == null) {
                // Le token est valide, on réinitialise le MDP
                if (checkBoolean) {
                    if (mdp != "") {
                        utilisateursModel.getIdentifiantFromEmail(email, function (identifiant, error) {
                            if (error == null) {
                                utilisateursModel.changeMDP(identifiant, saltHashPassword(mdp), function (error) {
                                    if (error == null) {
                                        utilisateursModel.cleanResetPassword(identifiant, function (error) {
                                            if (error == null) {
                                                res.render('confirmationReinitialisation.ejs', {
                                                    message: "Le mot de passe a bien été changé."
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
                        });
                    }
                    else {
                        res.render('reinitialiseMDP.ejs', {message: 'Merci de renseigner un mot de passe.'});
                    }
                }
                // Le token n'est pas valide ou la date a expiré ou l'email n'est pas bon
                else {
                    res.render('reinitialiseMDP.ejs', {message: 'Il y a eu un problème pour la réinitialisation de votre mot de passe, merci de refaire la procédure de réinitialisation pour accéder à votre compte.'});
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
}