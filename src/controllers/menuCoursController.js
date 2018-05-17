var coursModel = require('../models/cours');
var utilisateurModel = require('../models/utilisateurs');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        var idUnite = req.params.idUnite;
        coursModel.getMenuCours(idUnite, function(data, error) {
            if (error == null) {
                coursModel.getOrdreFromIdUnite(idUnite, function(ordreUnite, error) {
                    if (error == null) {
                        coursModel.getNomFromIdUnite(idUnite, function(nomUnite, error) {
                           if (error == null) {
                               utilisateurModel.getArrayCoursRead(req.user.identifiant, function(coursRead, error) {
                                   if (error == null) {
                                       // convert json in a array
                                       var coursReadArray = [];
                                       for (var i = 0; i < coursRead.length; i++) {
                                           coursReadArray.push(coursRead[i].idcours);
                                       }
                                       res.render('menuCours.ejs', {
                                           data: data,
                                           idUnite: idUnite,
                                           ordreUnite: ordreUnite,
                                           nomUnite: nomUnite,
                                           coursReadArray: coursReadArray,
                                       });
                                   }
                                   else {
                                       res.render('error.ejs', {message: error, error: error});
                                   }
                               });
                           }
                           else {

                           }
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