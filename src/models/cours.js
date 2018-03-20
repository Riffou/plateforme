var db = require("../models/base").db;

module.exports = {
    getUnites: function(callback) {
        db.any('SELECT nom from public.unites ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getMenuCours: function(idUnite, callback) {
        db.any('SELECT nom from public.cours WHERE idunite = $1 ORDER BY ordre', [idUnite])
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    hasPrevious: function(idUnite) {
        if (idUnite == 1) {
            return false;
        }
        else {
            return true;
        }
    },
    hasNext: function(idUnite, idCours, callback) {
        db.one('SELECT MAX(ordre) FROM cours WHERE idunite = $1', [idUnite])
            .then(function(data) {
                if (idCours < data.max) {
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
    doesLessonExist: function(idUnite, idCours, callback) {
        db.one('SELECT COUNT(nom) FROM cours WHERE idunite = $1 AND ordre = $2', [idUnite, idCours])
            .then(function(data) {
                if (data.count == 1) {
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
