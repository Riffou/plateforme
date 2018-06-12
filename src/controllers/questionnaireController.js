var coursModel = require('../models/cours');
var async = require('async');
var fs = require('fs');

var self = module.exports = {
    run: function(req, res) {
        // On récupère toutes les catégories de cours et les cours puis les challenges
        coursModel.getUnites(function(dataUnites, error) {
            if (error == null) {
                // On transforme JSON en ARRAY
                var i;
                var unitesArray = [];
                var coursArray = [];
                var globalJSON = {};
                for (i = 0; i < dataUnites.length; i++) {
                    unitesArray.push([dataUnites[i].id, dataUnites[i].nom]);
                }
                // Pour chaque catégorie
                async.each(unitesArray, function(item, callbackAsync) {
                        var id = item[0];
                        if (id > 0) {
                            coursModel.getMenuCours(id, function(dataCours, error) {
                               if (error == null) {
                                   // Pour chaque cours
                                   coursArray = [];
                                   for (i = 0; i < dataCours.length; i++) {
                                       coursArray.push([dataCours[i].id, dataCours[i].nom]);
                                   }
                                   globalJSON[id] = coursArray;
                                   callbackAsync();
                               }
                               else {
                                   callbackAsync();
                               }
                            });
                        }
                        else {
                            callbackAsync();
                        }
                    },
                    function(error) {
                        // All tasks are done now
                        if(error == null) {
                            console.log(globalJSON);
                            res.render('questionnaire.ejs', {unitesArray: unitesArray, globalJSON: globalJSON})
                        }
                        else {
                            res.render('error.ejs', { message: error, error: error });
                        }
                    }
                );
            }
            else {
                res.render('error.ejs', { message: error, error: error });
            }
        });
    },
    save: function(req, res) {
        coursModel.getIdCoursAndIdUnites(function(data, error) {
            if (error == null) {
                var questionnaireJSON = {};
                var i, idCours;
                var radio, textArea;
                // RadioButton et TextArea
                for (i = 0; i < data.length; i++) {
                    idCours = data[i].id;
                    textArea = 'textArea';
                    radio = 'radio';
                    radio += idCours;
                    textArea += idCours;
                    questionnaireJSON[idCours] = [req.body[radio], req.body[textArea]];
                }
                questionnaireJSON.utilisateur = req.user;
                console.log(questionnaireJSON);
                var stringJSON = JSON.stringify(questionnaireJSON);
                fs.appendFile('src/public/questionnaire/questionnaire.txt', stringJSON, function (err) {
                    if (err == null) {
                        res.redirect('/?questionnaire=ok')
                    }
                    else {
                        res.render('error.ejs', { message: error, error: error });
                    }
                });
            }
            else {
                res.render('error.ejs', { message: error, error: error });
            }
        })
    }
}