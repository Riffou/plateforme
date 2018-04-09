var challengesModel = require('../models/challenges');
var utilisateurModel = require('../models/utilisateurs');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        challengesModel.getMenu(function(data, error) {
            if (error == null) {
                // render the view
                utilisateurModel.getArrayChallengeValidated(req.user.identifiant, function(challengeValide, error) {
                   if (error == null) {
                       // convert json in a array
                       var challengeValideArray = [];
                       for (var i = 0; i < challengeValide.length; i++) {
                           challengeValideArray.push(challengeValide[i].idchallenge);
                       }
                       res.render('menuChallenges.ejs', {data: data, challengeValideArray: challengeValideArray});
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