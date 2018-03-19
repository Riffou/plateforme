var pgp = require('pg-promise')(/*options*/);
var dbconfig = require('../config/settings.js').settings;
var db = pgp(dbconfig);

module.exports = {
    getUnites: function(callback) {
        db.any('SELECT nomunite from public.unites ORDER BY ordreunite', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    getMenuCours: function(numeroUnite, callback) {
        db.any('SELECT nomcours from public.cours WHERE idunite = $1 ORDER BY ordrecours', [numeroUnite])
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    },
    hasPrevious: function(numeroUnite) {
        if (numeroUnite == 1) {
            return false;
        }
        else {
            return true;
        }
    },
    hasNext: function(numeroUnite, numeroCours, callback) {
        db.one('SELECT MAX(ordrecours) FROM cours WHERE idunite = $1', [numeroUnite])
            .then(function(data) {
                if (numeroCours < data.max) {
                    callback(true, null);
                }
                else {
                    callback(false, null);
                }
            })
            .catch(function(data) {
                callback(null, error);
            })
    }
}
