var coursModel = require('../models/cours');
var utilisateurModel = require('../models/utilisateurs');

var getDataForMenuUnites = function(identifiant, callback) {
    // Retrieve data from DB
    coursModel.getUnites(function(dataUnites, error) {
        var numberOfUnity = dataUnites.length;
        if (error == null) {
            // render the view
            coursModel.getIdCoursAndIdUnites(function(dataIdCoursAndUnites, error) {
                if (error == null) {
                    // déclaration des tableaux json
                    // jsonUnitesId : key = idUnite, valeur = tableau qui contient les ids des cours
                    // arrayUnitesLus : key = idUnite, valeur = tableau qui contient les ids des cours lus
                    // arrayUnitesSize : key = idUnite, valeur = tableau de 2 valeurs : 1ère valeur : nombre de cours dans l'unité, 2ème valeur : nombre de cours lus dans l'unité
                    var jsonUnitesId = {};
                    var arrayUnitesLus = {};
                    var arrayUnitesSize = {};

                    // initialisation des tableaux json
                    for (var i = 0; i < numberOfUnity; i++) {
                        jsonUnitesId[dataUnites[i].id] = [];
                        arrayUnitesSize[dataUnites[i].id] = [];
                        arrayUnitesLus[dataUnites[i].id] = true;
                    }


                    for (var i = 0; i < dataIdCoursAndUnites.length; i++) {
                        jsonUnitesId[dataIdCoursAndUnites[i].idunite].push(dataIdCoursAndUnites[i].id);
                    }
                    utilisateurModel.getArrayCoursRead(identifiant, function(dataCoursRead, error) {
                        if (error == null) {
                            // converti json en array
                            var coursLuArray = [];
                            for (var i = 0; i < dataCoursRead.length; i++) {
                                coursLuArray.push(dataCoursRead[i].idcours);
                            }

                            // pour chaque unite on vérifie que tous les cours sont lus
                            for (var key in jsonUnitesId) {
                                var nbreCoursLus = 0;
                                arrayUnitesSize[key].push(jsonUnitesId[key].length);
                                for(var i = 0; i < jsonUnitesId[key].length; i++) {
                                    if (coursLuArray.indexOf(jsonUnitesId[key][i]) == -1) {
                                        arrayUnitesLus[key] = false;
                                    }
                                    else {
                                        nbreCoursLus += 1;
                                    }
                                }
                                arrayUnitesSize[key].push(nbreCoursLus);
                            }
                            callback(dataUnites, arrayUnitesLus, arrayUnitesSize, null);
                        }
                        else {
                            callback(null, null, null, error);
                        }
                    });
                }
                else {
                    callback(null, null, null, error);
                }
            });
        }
        else {
            callback(null, null, null, error);
        }
    });
};

module.exports = {
    run: function (req, res) {
        var identifiant = req.user.identifiant;
        getDataForMenuUnites(identifiant, function(dataUnites, arrayUnitesLus, arrayUnitesSize, error) {
            if (error == null) {
                res.render('menuUnites.ejs', {data: dataUnites, arrayUnitesLus: arrayUnitesLus, arrayUnitesSize: arrayUnitesSize});
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}