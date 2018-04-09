var coursModel = require('../models/cours');
var utilisateurModel = require('../models/utilisateurs');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        var identifiant = req.user.identifiant;
        coursModel.getUnites(function(dataUnites, error) {
            var numberOfUnity = dataUnites.length;
            if (error == null) {
                // render the view
                coursModel.getIdCoursAndIdUnites(function(dataIdCoursAndUnites, error) {
                    if (error == null) {
                       // initialisation json array ensemble cours
                       var jsonUnitesId = {};
                       var arrayUnitesLus = {};
                       for (var i = 0; i < numberOfUnity; i++) {
                           jsonUnitesId[dataUnites[i].id] = [];
                           arrayUnitesLus[dataUnites[i].id] = true;
                       }
                       // remplissage json array ensemble cours
                       for (var i = 0; i < dataIdCoursAndUnites.length; i++) {
                           jsonUnitesId[dataIdCoursAndUnites[i].idunite].push(dataIdCoursAndUnites[i].id);
                       }
                       utilisateurModel.getArrayCoursRead(identifiant, function(dataCoursRead, error) {
                           if (error == null) {
                               // convert json to array
                               var coursLuArray = [];
                               for (var i = 0; i < dataCoursRead.length; i++) {
                                   coursLuArray.push(dataCoursRead[i].idcours);
                               }

                               // pour chaque unite on vérifie que tous les cours sont lus

                               for (var key in jsonUnitesId) {
                                   for(var i = 0; i < jsonUnitesId[key].length; i++) {
                                       if (coursLuArray.indexOf(jsonUnitesId[key][i]) == -1) {
                                           arrayUnitesLus[key] = false;
                                       }
                                   }
                               }
                               res.render('menuUnites.ejs', {data: dataUnites, arrayUnitesLus: arrayUnitesLus});
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
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}