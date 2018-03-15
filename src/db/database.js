var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../db/settings.js').settings


var db = pgp(dbconfig);


function getTest() {
    db.any('SELECT * from public.playground', null)
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
