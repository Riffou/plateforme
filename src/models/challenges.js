var db = require("../models/base").db;

module.exports = {
    getMenuChallenges: function(callback) {
        db.any('SELECT nom, id FROM public.challenges ORDER BY ordre', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    }
}