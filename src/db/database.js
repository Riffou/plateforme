var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').configdb();


var db = pgp(dbconfig);


function getTest() {
    db.any('SELECT nomUnite from public.unites', null)
        .then(function(data) {
            console.log(data);
        })
        .catch(function(error) {
            console.log(error);
        })
    console.log("Fin");
}

getTest();

module.exports = {
}
