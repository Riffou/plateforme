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
    },
    isFlagCorrect: function(req, res) {
        var flag = req.body.flag;
        var idChallenge = req.params.idChallenge;
        challengesModel.validateFlag(idChallenge, flag, function (isFlagBoolean, error) {
            if (error == null) {
                if (isFlagBoolean) {
                    res.status(200).json({
                        flag: true
                    });
                }
                else {
                    res.status(200).json({
                        flag: false
                    });
                }
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        });
    }
}