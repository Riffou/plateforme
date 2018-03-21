var challengesModel = require('../models/challenges');


module.exports = {
    run: function (req, res) {
        var idChallenge = req.params.idChallenge;
        console.log(idChallenge);
        var flagUser = req.body.flagInput;
        console.log("Bonjour " + flagUser);
        challengesModel.validate(idChallenge, flagUser, function(booleanValidate, error) {
            if (error == null) {
                challengesModel.getOrdreFromId(idChallenge, function(ordreChallenge, error) {
                    if (error == null) {
                        res.render('challenge.ejs', {
                            idChallenge: idChallenge,
                            ordreChallenge: ordreChallenge,
                            valide: booleanValidate
                        });
                    }
                    else {
                        res.render('error.ejs', {message: error, error: error});
                    }
                });
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}