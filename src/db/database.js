var pgp = require('pg-promise')(/*options*/)
var dbconfig = require('../config/settings.js').configdb();
var db = pgp(dbconfig);

var crypto = require('crypto');


var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

var sha256 = function(password, salt){
    var hash = crypto.createHmac('sha256', 'saltest'); /** Hashing algorithm sha256 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = 'saltest';
    var passwordData = sha256(userpassword, salt);
    // console.log('UserPassword = '+userpassword);
    // console.log('Passwordhash = '+passwordData.passwordHash);
}

saltHashPassword('pass');

/*function getTest() {
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
*/