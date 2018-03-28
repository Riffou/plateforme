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
    }
}