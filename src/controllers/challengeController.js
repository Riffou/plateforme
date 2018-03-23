var challengesModel = require('../models/challenges');
var config = require('../config/settings').config();

module.exports = {
    run: function (req, res) {
        var idChallenge = req.params.idChallenge;
        challengesModel.getOrdreFromId(idChallenge, function(ordreChallenge, error) {
            if (error == null) {
                res.render('challenge.ejs', {idChallenge: idChallenge, ordreChallenge: ordreChallenge, host: config.hostURLChallenges});
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}