var db = require("../models/base").db;

module.exports = {
    getMenu: function (callback) {
        db.any('SELECT nom, id, difficulte FROM public.challenges ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getOrdreFromId: function (idChallenge, callback) {
        db.one('SELECT ordre FROM challenges WHERE id = $1', [idChallenge])
            .then(function (data) {
                callback(data.ordre, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    // Validation challenge
    validateFlag: function (idChallenge, flagUser, callback) {
        db.one('SELECT flag FROM challenges WHERE id = $1', [idChallenge])
            .then(function (data) {
                if (data.flag == flagUser) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getSolutionOfChallenge: function(idChallenge, callback) {
        db.one('SELECT solution FROM Challenges WHERE id = $1', [idChallenge])
            .then(function(data) {
                callback(data, null);
            })
            .catch(function(error) {
                callback(null, error)
            })
    },
}
