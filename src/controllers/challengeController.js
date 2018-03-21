var challengesModel = require('../models/challenges');

module.exports = {
    run: function (req, res) {
        var idChallenge = req.params.idChallenge;
        challengesModel.getOrdreFromId(idChallenge, function(ordreChallenge, error) {
            if (error == null) {
                res.render('challenge.ejs', {idChallenge: idChallenge, ordreChallenge: ordreChallenge});
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}