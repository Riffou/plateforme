var pgp = require('pg-promise')(/*options*/);
var dbconfig = require('../config/settings.js').settings;
var db = pgp(dbconfig);

module.exports = {
    db: db
}