var challengesModel = require('../models/challenges');
var utilisateurModel = require('../models/utilisateurs');
var config = require('../config/settings').config();

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
                       challengesModel.getNombreValidations(function(nombreValidationsArray, error) {
                           if (error == null) {
                               var jsonNombreValidations = {};
                               for (var i = 0; i < nombreValidationsArray.length; i++) {
                                   jsonNombreValidations[nombreValidationsArray[i].idchallenge] = nombreValidationsArray[i].count;
                               }
                               res.render('menuChallenges.ejs', {
                                   data: data,
                                   challengeValideArray: challengeValideArray,
                                   jsonNombreValidations: jsonNombreValidations
                               });
                           }
                           else {
                               if (config.mode == 'local') {
                                   res.render('error.ejs', {message: error, error: error});
                               }
                               else {
                                   res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                               }                           }
                       });
                   }
                   else {
                       if (config.mode == 'local') {
                           res.render('error.ejs', {message: error, error: error});
                       }
                       else {
                           res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                       }
                   }
                });
            }
            else {
                if (config.mode == 'local') {
                    res.render('error.ejs', {message: error, error: error});
                }
                else {
                    res.render('error.ejs', {message: 'Une erreur est survenue.', error:"Une erreur est survenue."})
                }
            }
        });
    }
}