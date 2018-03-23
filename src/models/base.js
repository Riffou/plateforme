var pgp = require('pg-promise')(/*options*/);
var dbconfig = require('../config/settings.js').configdb();
var db = pgp(dbconfig);

module.exports = {
    db: db
}