var pgp = require('pg-promise')(/*options*/);
var dbconfig = require('../config/settings.js').settings;
var db = pgp(dbconfig);

module.exports = {
    getUnites: function(callback) {
        db.any('SELECT nomunites from public.unites ORDER BY ordreunites', null)
            .then(function (data) {
                callback(data, null);
            })
            .catch(function (error) {
                callback(null, error);
            })
    }
}
