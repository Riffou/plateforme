var db = require("../models/base").db;

module.exports = {
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
    isPseudoAvailable: function(pseudo, callback) {
        db.one('SELECT COUNT(pseudo) FROM utilisateurs WHERE pseudo = $1', [pseudo])
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
    inscription: function(email, pseudo, passwordHash, callback) {
        db.none('INSERT INTO utilisateurs (pseudo, email, mdp) VALUES ($1, $2, $3)', [pseudo, email, passwordHash])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    },
    userExists: function(pseudo, callback) {
        db.one('SELECT COUNT(pseudo) FROM Utilisateurs WHERE pseudo = $1', [pseudo])
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
    isPasswordCorrect: function(pseudo, passwordHash, callback) {
        db.one('SELECT mdp FROM Utilisateurs WHERE pseudo = $1', [pseudo])
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
    getEmail: function(pseudo, callback) {
        db.one('SELECT email FROM utilisateurs WHERE pseudo = $1', [pseudo])
            .then(function(data) {
                callback(data.email, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    changeMDP: function(pseudo, mdp, callback) {
        db.none('UPDATE utilisateurs SET mdp = $1 WHERE pseudo = $2', [mdp, pseudo])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    isChallengeValidated: function(pseudo, idChallenge, callback) {
        db.one('SELECT COUNT(pseudo) FROM suiviUtilisateursChallenges WHERE idChallenge = $1 AND pseudo = $2', [idChallenge, pseudo])
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
    validateChallenge: function(pseudo, idChallenge, callback) {
        db.none('INSERT INTO suiviUtilisateursChallenges (pseudo, idChallenge) VALUES ($1, $2)', [pseudo, idChallenge])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    },
    getArrayChallengeValidated: function(identifiant, callback) {
        db.any('SELECT idChallenge FROM suiviUtilisateursChallenges WHERE pseudo = $1', [identifiant])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    getArrayCoursRead: function(identifiant, callback) {
        db.any('SELECT idCours FROM suiviUtilisateursCours WHERE pseudo = $1', [identifiant])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error);
            })
    },
    isLessonValidated: function(idCours, identifiant, callback) {
        db.one('SELECT COUNT(pseudo) FROM suiviUtilisateursCours WHERE idCours = $1 AND pseudo = $2', [idCours, identifiant])
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
        db.none('INSERT INTO suiviUtilisateursCours (pseudo, idCours) VALUES ($1, $2)', [identifiant, idCours])
            .then(function () {
                    callback(null);
                }
            )
            .catch(function(error) {
                callback(error);
            })
    }
}