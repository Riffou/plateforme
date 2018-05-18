var challengesModel = require('../models/challenges');
var async = require('async');


function getChallenges(callback) {
    challengesModel.getMenu(function(menuChallenges, error) {
        if (error == null) {
            callback(menuChallenges, null);
        }
        else {
            callback(null, error);
        }
    });
}

function reorderChallenges(ordreChallengeToAdd, callback) {
    challengesModel.getOrderOfChallenges(function(data, error) {
        if (error == null) {
            // convert json to array
            var ordreArray = [];
            for (var i = 0; i < data.length; i++) {
                if (ordreChallengeToAdd == i+1) {
                    ordreArray.push(0);
                }
                ordreArray.push(data[i].id);
            }
            async.each(ordreArray, function(id, callbackAsync) {
                    if (id > 0) {
                        console.log(id);
                        challengesModel.updateOrdreChallenges((ordreArray.indexOf(id) + 1), id, function (error) {
                            if (error == null) {
                                callbackAsync();
                            }
                            else {
                                console.log(error);
                                callbackAsync();
                            }
                        });
                    }
                    else {
                        callbackAsync();
                    }
                },
                function(error) {
                    if(error == null) {
                        callback(null);
                    }
                    else {
                        callback(error);
                    }
                });
        }
        else {
            callback(error);
        }
    });
}

var self = module.exports = {
    runChallenges: function(req, res) {
        var data = {};
        getChallenges(function (dataChallenges, error) {
            if (error == null) {
                data.dataChallenges = dataChallenges;
                res.render('dashboardChallenges.ejs', data);
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    },
    runFormChallenges: function(req, res) {
        var idChallenge = req.params.idChallenge;
        console.log("Id Challenge: " + idChallenge);
        challengesModel.getNumberOfChallenges(function (numberOfChallenges, error) {
            if (error == null) {
                if (idChallenge != null) {
                    challengesModel.getAllOfOneChallenge(idChallenge, function (data, error) {
                        if (error == null) {
                            console.log(data);
                            res.render('formChallenge.ejs', {
                                numberOfChallenges: numberOfChallenges - 1,
                                nom: data.nom,
                                ordre: data.ordre,
                                description: data.description,
                                flagChallenge: data.flag,
                                indice: data.indice,
                                solution: data.solution,
                                difficulte: data.difficulte
                            });
                        }
                        else {
                            res.render('error.ejs', {message: error, error: error});
                        }
                    });
                }
                // Si on ajoute un challenge
                else {
                    res.render('formChallenge.ejs', {numberOfChallenges: numberOfChallenges});
                }
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    },
    addChallenge: function (req, res) {
        // Faire tout le addChallenge
        var nom = req.body.titleInput;
        var ordreString = req.body.ordreInput;
        var difficulteInput = req.body.difficulteInput;

        var flag = req.body.flagInput;
        var indice = req.body.indiceInput;
        var solution = req.body.solutionInput;

        var description = req.body.descriptionInput;

        if (nom != ""
            && ordreString != ""
            && difficulteInput != ""
            && flag != ""
            && solution != ""
            && description != "") {
            var ordre = parseInt(ordreString);
            var difficulte = parseInt(difficulteInput);
            // re-order categories
            reorderChallenges(ordre, function (error) {
                if (error == null) {
                    if (typeof indice == "undefined") {
                        indice = null;
                    }
                    challengesModel.addChallenge(nom, ordre, difficulte, flag, indice, solution, description, function (idChallenge, error) {
                        if (error == null) {
                            res.redirect('/admin/challenges/');
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
    },
    saveModifiedChallenge: function (req, res) {
        var idChallenge = req.params.idChallenge;
        // Faire tout le addChallenge
        var nom = req.body.titleInput;
        var ordreString = req.body.ordreInput;
        var difficulteInput = req.body.difficulteInput;

        var flag = req.body.flagInput;
        var indice = req.body.indiceInput;
        var solution = req.body.solutionInput;

        var description = req.body.descriptionInput;

        if (nom != ""
            && ordreString != ""
            && difficulteInput != ""
            && flag != ""
            && solution != ""
            && description != "") {
            var ordre = parseInt(ordreString);
            var difficulte = parseInt(difficulteInput);
            // delete challenge
            challengesModel.deleteChallenge(idChallenge, function(error) {
                if (error == null) {
                    // re-order challenges
                    reorderChallenges(ordre, function (error) {
                        if (error == null) {
                            if (typeof indice == "undefined") {
                                indice = null;
                            }
                            challengesModel.addChallenge(nom, ordre, difficulte, flag, indice, solution, description, function (idChallenge, error) {
                                if (error == null) {
                                    res.redirect('/admin/challenges/');
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
    },
    deleteChallenge: function (req, res) {
        var idChallenge = req.params.idChallenge;
        challengesModel.deleteChallenge(idChallenge, function (error) {
            if (error == null) {
                reorderChallenges(0, function (error) {
                    if (error == null) {
                        res.redirect('/admin/challenges');
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
    },
    updateChallenges: function (req, res) {
        var data = JSON.parse(req.body.json);
        async.forEachOf(data, function (item, key, callback) {
                challengesModel.updateChallenge(key, item[0], item[1], function (error) {
                    if (error == null) {
                        callback();
                    }
                    else {
                        console.log(error);
                    }
                });
            },
            function (error) {
                // All tasks are done now
                if (error == null) {
                    res.status(200).json({});
                }
                else {
                    res.status(500).send(error);
                }

            }
        );
    }
}