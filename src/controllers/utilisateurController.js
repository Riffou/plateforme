var utilisateursModel = require('../models/utilisateurs');
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
    runInscription: function (req, res) {
        var identifiant = req.body.identifiantInput;
        var email = req.body.emailInput;
        var password = req.body.passwordInput;

        if (identifiant != "" && email != "" && password != "") {
            utilisateursModel.isEmailAvailable(email, function (emailBoolean, error) {
                if (error == null) {
                    if (emailBoolean) {
                        utilisateursModel.isPseudoAvailable(identifiant, function (pseudoBoolean, error) {
                            if (error == null) {
                                if (pseudoBoolean) {
                                    utilisateursModel.inscription(email, identifiant, saltHashPassword(password), function (error) {
                                        if (error == null) {
                                            req.session.user = {};
                                            req.session.user.identifiant = identifiant;
                                            req.session.user.email = email;
                                            res.redirect('/?inscription=ok');
                                        }
                                        else {
                                            res.render('error.ejs', {message: error, error: error});
                                        }
                                    });
                                }
                                else {
                                    res.render('inscription.ejs', {erreur: "Cet identifiant est déjà utilisé par un autre utilisateur.", identifiant: identifiant, email: email});
                                }
                            }
                            else {
                                res.render('error.ejs', {message: error, error: error});
                            }
                        })
                    }
                    else {
                        res.render('inscription.ejs', {erreur: "Cet email est déjà utilisé par un autre utilisateur.", identifiant: identifiant, email: email});
                    }
                }
                else {
                    res.render('error.ejs', {message: error, error: error});
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
                                   req.session.user = {};
                                   req.session.user.identifiant = identifiant;
                                   utilisateursModel.getEmail(identifiant, function(email, error) {
                                       if (error == null) {
                                           req.session.user.email = email;
                                           res.redirect('/?connexion=ok');
                                       }
                                       else {
                                           res.render('error.ejs', {message: error, error: error});
                                       }
                                   });
                               }
                               else {
                                   res.render('connexion.ejs', {erreur: "L'identifiant ou le mot de passe sont incorrects.", identifiant: identifiant});
                               }
                           }
                           else {
                               res.render('error.ejs', {message: error, error: error});
                           }
                       });
                   }
                   else {
                       res.render('connexion.ejs', {erreur: "L'identifiant ou le mot de passe sont incorrects.", identifiant: identifiant});
                   }
               }
               else {
                   res.render('error.ejs', {message: error, error: error});
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
        res.render('profil.ejs', {email: req.user.email, identifiant: req.user.identifiant});
    },
    reinitialiseMDP: function(req, res) {
        var email = req.body.emailInput;
        if (email != "") {
            utilisateursModel.emailExists(email, function (existsBoolean, error) {
                if (error == null) {
                    if (existsBoolean) {
                        
                    }
                    else {
                        res.render('motDePasseOublie.ejs', {
                            erreur: "L'adresse email n'est pas enregistrée dans notre base de données, essayez avec une autre mail.",
                            email: email
                        });
                    }
                }
                else {
                    res.render('error.ejs', {message: error, error: error});
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
    changeMDP: function(req, res) {
        var ancienMDP = req.body.ancienMDP;
        var nouveauMDP = req.body.nouveauMDP;

        if (ancienMDP != "" && nouveauMDP != ""){
            utilisateursModel.isPasswordCorrect(req.user.identifiant, saltHashPassword(ancienMDP), function(booleanPass, error) {
                if (error == null) {
                    if (booleanPass) {
                        utilisateursModel.changeMDP(req.user.identifiant, saltHashPassword(nouveauMDP), function (error) {
                            if (error == null) {
                                res.render('profil.ejs', {message: "Le mot de passe a bien été changé", email: req.user.email, identifiant: req.user.identifiant});
                            }
                            else {
                                res.render('error.ejs', {message: error, error: error});
                            }
                        })
                    }
                    else {
                        res.render('profil.ejs', {erreur: "L'ancien mot de passe n'est pas valide.", email: req.user.email, identifiant: req.user.identifiant});
                    }
                }
                else {
                    res.render('error.ejs', {message: error, error: error});
                }
            })
        }
        else {
            res.render('profil.ejs', {
                erreur: "Veuillez remplir tous les champs !", email: req.user.email, identifiant: req.user.identifiant
            });
        }
    }
}