var db = require("../models/base").db;

module.exports = {
    userExists: function(identifiant, callback) {
        db.one('SELECT COUNT(identifiant) FROM Administrateurs WHERE identifiant = $1', [identifiant])
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
    isPasswordCorrect: function(identifiant, passwordHash, callback) {
        db.one('SELECT mdp FROM Administrateurs WHERE identifiant = $1', [identifiant])
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
    updateLastConnection: function(identifiant, date, callback) {
        db.none('UPDATE Administrateurs SET lastConnection = $1 WHERE identifiant = $2', [date, identifiant])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    },
    updateLastFailedConnection: function(identifiant, date, callback) {
        db.none('UPDATE utilisateurs SET lastFailedConnection = $1 WHERE identifiant = $2', [date, identifiant])
            .then(function() {
                callback(null);
            })
            .catch(function(error) {
                callback(error);
            })
    }
}