var db = require("../models/base").db;

var self = module.exports = {
    isEmailAvailable: function(email, callback) {
        db.one('SELECT COUNT(email) FROM utilisateurs WHERE email = $1', [email])
            .then(function(data) {
                if (data.count == 0) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    isIdentifiantAvailable: function(identifiant, callback) {
        db.one('SELECT COUNT(identifiant) FROM utilisateurs WHERE identifiant = $1', [identifiant])
            .then(function(data) {
                if (data.count == 0) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    inscription: function(email, identifiant, passwordHash, callback) {
        db.none('INSERT INTO utilisateurs (identifiant, email, mdp) VALUES ($1, $2, $3)', [identifiant, email, passwordHash])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    },
    userExists: function(identifiant, callback) {
        db.one('SELECT COUNT(identifiant) FROM Utilisateurs WHERE identifiant = $1', [identifiant])
            .then(function(data) {
                if (data.count == 1) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    emailExists: function(email, callback) {
        db.one('SELECT COUNT(email) FROM Utilisateurs WHERE email = $1', [email])
            .then(function(data) {
                if (data.count == 1){
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
    isPasswordCorrect: function(identifiant, passwordHash, callback) {
        db.one('SELECT mdp FROM Utilisateurs WHERE identifiant = $1', [identifiant])
            .then(function(data) {
                if (passwordHash == data.mdp) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getEmail: function(identifiant, callback) {
        db.one('SELECT email FROM utilisateurs WHERE identifiant = $1', [identifiant])
            .then(function(data) {
                callback(data.email, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    changeMDP: function(identifiant, mdp, callback) {
        db.none('UPDATE utilisateurs SET mdp = $1 WHERE identifiant = $2', [mdp, identifiant])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    isChallengeValidated: function(identifiant, idChallenge, callback) {
        db.one('SELECT COUNT(identifiant) FROM suiviUtilisateursChallenges WHERE idChallenge = $1 AND identifiant = $2', [idChallenge, identifiant])
            .then(function (data) {
                if (data.count == 1) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function (error) {
                callback(null, error)
            })
    },
    validateChallenge: function(identifiant, idChallenge, callback) {
        db.none('INSERT INTO suiviUtilisateursChallenges (identifiant, idChallenge) VALUES ($1, $2)', [identifiant, idChallenge])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    },
    getArrayChallengeValidated: function(identifiant, callback) {
        db.any('SELECT idChallenge FROM suiviUtilisateursChallenges WHERE identifiant = $1', [identifiant])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getArrayCoursRead: function(identifiant, callback) {
        db.any('SELECT idCours FROM suiviUtilisateursCours WHERE identifiant = $1', [identifiant])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    isLessonValidated: function(idCours, identifiant, callback) {
        db.one('SELECT COUNT(identifiant) FROM suiviUtilisateursCours WHERE idCours = $1 AND identifiant = $2', [idCours, identifiant])
            .then(function (data) {
                if (data.count == 1) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function (error) {
                callback(null, error)
            })
    },
    validateLesson: function(idCours, identifiant, callback) {
        db.none('INSERT INTO suiviUtilisateursCours (identifiant, idCours) VALUES ($1, $2)', [identifiant, idCours])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    },
    getIdentifiantFromEmail: function(email, callback) {
        db.any('SELECT identifiant FROM Utilisateurs WHERE email = $1', [email])
            .then(function (data) {
                console.log(data);
                console.log(data[0].identifiant);
                callback(data[0].identifiant, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    setToken: function(resetToken, expiryDate, email, callback) {
        db.none('UPDATE utilisateurs SET resetToken = $1, expiryDate = $2 WHERE email = $3', [resetToken, expiryDate, email])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    checkToken: function(token, email, callback) {
        db.one('SELECT COUNT(email) FROM Utilisateurs WHERE resetToken = $1 AND email = $2', [token, email])
            .then(function(data) {
                if (data.count == 1) {
                    // Check expiry date
                    db.one('SELECT expiryDate FROM Utilisateurs WHERE email = $1', [email])
                        .then(function(data) {
                            if (Date.now() < data.expirydate) {
                                callback(true, null);
                            }
                            else {
                                callback(false, null);
                            }
                        })
                        .catch(function(error) {
                            callback(null, error);
                        })
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    cleanResetPassword: function(identifiant, callback) {
        db.none('UPDATE utilisateurs SET resetToken = null, expiryDate = null WHERE identifiant = $1', [identifiant])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    getPourcentageOfValidatedChallenges: function(identifiant, callback) {
        db.one('SELECT COUNT(id) FROM challenges')
            .then(function (data1) {
                db.one('SELECT COUNT(identifiant) FROM suiviUtilisateursChallenges WHERE identifiant = $1', [identifiant])
                    .then(function (data2) {
                        callback(Math.round(100*data2.count/data1.count), null);
                    })
                    .catch(function (error) {
                        callback(null, error);
                    })
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getPourcentageOfCoursLus: function(identifiant, callback) {
        db.one('SELECT COUNT(id) FROM cours')
            .then(function (data1) {
                db.one('SELECT COUNT(identifiant) FROM suiviUtilisateursCours WHERE identifiant = $1', [identifiant])
                    .then(function (data2) {
                        callback(Math.round(100*data2.count/data1.count), null);
                    })
                    .catch(function (error) {
                        callback(null, error);
                    })
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    hasCertificate: function(identifiant, callback) {
        self.getPourcentageOfCoursLus(identifiant, function(pourcentageCoursLus, error) {
            if (error == null) {
                self.getPourcentageOfValidatedChallenges(identifiant, function(pourcentageChallengesValidated, error) {
                    if (error == null) {
                        if (pourcentageCoursLus == 100 && pourcentageChallengesValidated == 100) {
                            callback(true, null);
                        }
                        else {
                            callback(false, null);
                        }
                    }
                    else {
                        callback(null, error);
                    }
                })
            }
            else {
                callback(null, error);
            }
        })
    },
    setSolutionChallenge: function(identifiant, idChallenge, solution, callback) {
        db.none('INSERT INTO solutionsChallengesUtilisateurs(idChallenge, identifiant, solution) VALUES ($1, $2, $3)', [idChallenge, identifiant, solution])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    }
}