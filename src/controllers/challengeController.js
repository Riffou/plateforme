var challengesModel = require('../models/challenges');
var utilisateurModel = require('../models/utilisateurs');
var config = require('../config/settings').config();
var exec = require('child_process').exec;
var async = require('async');
var request = require('request');

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Docker stuff
function inspect(callback, nomConteneur, object, whichServer) {
    console.log("Docker inspect");
    exec('docker inspect -f {{.State.Running}} ' + nomConteneur, function(error, stdout, stderr) {
        // Docker a trouvé un conteneur associé
        if (error == null) {
            // On vérifie qu'il est lancé
            if (stdout.includes("true")) {
                if (whichServer === 0) {
                    object.containerServerAlreadyRunning = true;
                    object.containerServerAlreadyCreated = true;
                }
                else if (whichServer === 1) {
                    object.containerBDDAlreadyCreated = true;
                    object.containerBDDAlreadyRunning = true;
                }
                else if (whichServer === 2) {
                    object.containerSeleniumAlreadyCreated = true;
                    object.containerSeleniumAlreadyRunning = true;
                }
                else if (whichServer === 3) {
                    object.containerCronAlreadyCreated = true;
                    object.containerCronAlreadyRunning = true;
                }
            }
            // S'il n'est pas lancé : on va supprimer le conteneur
            else {
                if (whichServer === 0) {
                    object.containerServerAlreadyCreated = true;
                }
                else if (whichServer === 1){
                    object.containerBDDAlreadyCreated = true;
                }
                else if (whichServer === 2){
                    object.containerSeleniumAlreadyCreated = true;
                }
                else if (whichServer === 3){
                    object.containerCronAlreadyCreated = true;
                }
            }
            callback();
        }
        // Docker n'a pas trouvé de conteneur associé, il renvoie une erreur
        else {
            callback();
        }
    });
}

function removeContainer(callback, nomConteneur, res, object, whichServer) {
    console.log("removeContainer");
    var containerAlreadyCreated, containerAlreadyRunning;
    // Serveur web
    if (whichServer === 0) {
        containerAlreadyCreated = object.containerServerAlreadyCreated;
        containerAlreadyRunning = object.containerServerAlreadyRunning;
    }
    // Serveur BDD
    else if (whichServer === 1) {
        containerAlreadyCreated = object.containerBDDAlreadyCreated;
        containerAlreadyRunning = object.containerBDDAlreadyRunning;
    }
    // Serveur Selenium
    else if (whichServer === 2) {
        containerAlreadyCreated = object.containerSeleniumAlreadyCreated;
        containerAlreadyRunning = object.containerSeleniumAlreadyRunning;
    }
    // Serveur Cron
    else if (whichServer === 3) {
        containerAlreadyCreated = object.containerCronAlreadyCreated;
        containerAlreadyRunning = object.containerCronAlreadyRunning;
    }

    if (containerAlreadyCreated === true && containerAlreadyRunning === false) {
        exec('docker rm ' + nomConteneur, function (error, stdout, stderr) {
            if (error == null) {
                if (whichServer === 0) {
                    object.containerServerAlreadyCreated = false;
                }
                else if (whichServer === 1) {
                    object.containerBDDAlreadyCreated = false;
                }
                else if (whichServer === 2) {
                    object.containerSeleniumAlreadyCreated = false;
                }
                else if (whichServer === 3) {
                    object.containerCronAlreadyCreated = false;
                }
                callback();
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        });
    }
    else {
        callback();
    }
}

function runContainerBDD(callback, nomConteneurBDD, nomImageBDD, res, object) {
    console.log('runContainerBDD');
    if (object.containerBDDAlreadyRunning === false) {
        exec('docker run -d -p 5432 --name ' + nomConteneurBDD + ' -e POSTGRES_PASSWORD=postgres ' + nomImageBDD
            , function (error, stdout, stderr) {
                if (error != null) {
                    console.log("Erreur : " + error);
                    res.status(500).send(error);
                }
                callback();
            });
    }
    else {
        callback();
    }
}

function runSeleniumContainer(callback, nomConteneurSelenium, res, object) {
    console.log('runSeleniumServer');
    if (object.containerSeleniumAlreadyRunning === false) {
        // Change Here
        exec('docker run -d --name ' + nomConteneurSelenium + ' -p 4444 selenium/standalone-chrome', function (error, stdout, stderr) {
            if (error != null) {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
            callback();
        });
    }
    else {
        callback();
    }
}

function runContainerServeurLinkedBDD(callback, nomConteneurServeur, nomConteneurBDD, nomImageServeur, res, object) {
    console.log('runContainerServeurLinkedBDD');
    console.log(object);

    if (object.containerServerAlreadyRunning === false) {
        exec('docker run -d -P --name ' + nomConteneurServeur + ' --link ' + nomConteneurBDD + ':alias -e NOM_CONTENEUR_BDD=' + nomConteneurBDD + ' ' + nomImageServeur
    , function (error, stdout, stderr) {
            if (error != null) {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
            callback();
        });
    }
    else {
        callback();
    }
}

function runContainerServeur(callback, nomConteneurServeur, nomImageServeur, res, object) {
    console.log('runContainerServeur');
    console.log(object);
    if (object.containerServerAlreadyRunning === false) {
        exec('docker run -d -P --name '+ nomConteneurServeur + ' ' + nomImageServeur
            , function (error, stdout, stderr) {
                if (error != null) {
                    console.log("Erreur : " + error);
                    res.status(500).send(error);
                }
                callback();
            });
    }
    else {
        callback();
    }
}

function getPortContainer(callback, nomConteneur, res, object) {
    console.log('getPortContainer');
    exec('docker inspect ' + nomConteneur + ' | grep "HostPort"', function(error, stdout, stderr) {
        if (error == null) {
            object.portServeur = stdout.match(/\d+/)[0];
        }
        else {
            console.log("Erreur : " + error);
            res.status(500).send(error);
        }
        callback();

    });
}

function runCronServeur(callback, portServeurWeb, nomConteneurCron, nomConteneurSelenium, res, object) {
    console.log('runCronServeur');
    if (object.containerCronAlreadyRunning === false) {
        exec('docker run -d -P --name ' + nomConteneurCron + ' --link ' + nomConteneurSelenium + ':' + nomConteneurSelenium + ' -e PORT_CONTENEUR_SERVEUR_WEB=' + portServeurWeb + ' -e NOM_CONTENEUR_SELENIUM=' + nomConteneurSelenium + ' cron_image', function (error, stdout, stderr) {
            if (error != null) {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
            callback();
        });
    }
    else {
        callback();
    }
}

function waitForContainerServeur(callback, portServeur) {
    console.log(portServeur);
    console.log('waitForContainerServeur');
    var isAlreadyPassed = false;
    var interval = setInterval(function () {
        var adresse = config.host;
        request('http://' + adresse + ':' + portServeur, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Si c'est la première fois qu'il passe dans la boucle
                if (isAlreadyPassed == false) {
                    callback();
                }
                // Sinon on clear l'intervalle
                isAlreadyPassed = true;
                clearInterval(interval);
            }
        })
    }, 100);
}

function waitForContainerBDD(callback, nomConteneurBDD, res) {
    console.log('waitForContainerBDD');
    exec('until docker run --rm --link ' + nomConteneurBDD + ':pg postgres pg_isready -U postgres -h pg; do sleep 1; done', function(error, stdout, stderr) {
        if (error != null) {
            console.log("Erreur : " + error);
            res.status(500).send(error);
        }
        callback();
    });
}

function stopAndRemoveContainer(nomConteneur, res, callback) {
    console.log("Stop and remove container");
    exec('docker inspect -f {{.State.Running}} ' + nomConteneur, function(error, stdout, stderr) {
        // Docker a trouvé un conteneur associé
        if (error == null) {
            // On vérifie qu'il est lancé
            if (stdout.includes("true")) {
                exec('docker stop ' + nomConteneur, function (error, stdout, stderr) {
                    if (error == null) {
                        exec('docker rm ' + nomConteneur, function (error, stdout, stderr) {
                            if (error == null) {
                                callback(null);
                            }
                            else {
                                callback(error);
                            }
                        });
                    }
                    else {
                        console.log("Erreur : " + error);
                        res.status(500).send(error);
                        callback(error);
                    }
                });
            }
            else {
                callback(null);
            }
        }
    });
}

// Load challenges
function loadChallengeSQL(req, res) {
    var object = {containerServerAlreadyRunning:false, containerServerAlreadyCreated:false, containerBDDAlreadyRunning:false, containerBDDAlreadyCreated:false, portServeur:""};
    var idChallenge = req.params.idChallenge;
    var nomConteneurServeur = req.user.identifiant + '_' + idChallenge;
    var nomConteneurBDD = nomConteneurServeur + '_db';
    var nomImageServeur = "challengesql_image";
    var nomImageBDD = "challengesql_db_image";

    async.series([
        // Vérification que le conteneur n'a pas déjà été lancé (Serveur Web)
        function(callback) {
            console.log(object);
            inspect(callback, nomConteneurServeur, object, 0);
        },
        // Vérification que le conteneur n'a pas déjà été lancé (BDD)
        function(callback) {
            inspect(callback, nomConteneurBDD, object, 1);
        },
        // Si le conteneur a déjà été créé mais est stoppé (Serveur)
        function(callback) {
            removeContainer(callback, nomConteneurServeur, res, object, 0);
        },
        // Si le conteneur a déjà été créé mais est stoppé (BDD)
        function(callback) {
            removeContainer(callback, nomConteneurBDD, res, object, 1);
        },
        // Lancement conteneur si le conteneur n'a pas été créé (BDD)
        function(callback) {
           runContainerBDD(callback, nomConteneurBDD, nomImageBDD, res, object);
        },
        // Lancement conteneur si le conteneur n'a pas été créé (Serveur)
        function(callback) {
           runContainerServeurLinkedBDD(callback, nomConteneurServeur, nomConteneurBDD, nomImageServeur, res, object);
        },
        // Récupération du port où le conteneur tourne (Serveur)
        function(callback) {
            getPortContainer(callback, nomConteneurServeur, res, object);
        },
        // Attente que le conteneur (Serveur) soit prêt
        function(callback) {
            waitForContainerServeur(callback, object.portServeur);
        },
        // Attente que le conteneur (BDD) soit prêt
        function(callback) {
            waitForContainerBDD(callback, nomConteneurBDD, res);
        }
    ], function(err) { //This function gets called after all the tasks have called their "task callbacks"
        if (err) {
            return next(err);
        }
        console.log(object.portServeur);
        res.status(200).send({port: object.portServeur, adresse: config.host});
    });
}

function loadChallengeOffuscation(req, res) {
    res.render('challOffuscation.ejs');
}

function loadChallengeFormulaireBloque(req, res) {
    res.render('challFormulaireBloque.ejs');
}

function loadChallengeFormulaireDesactive(req, res) {
    res.render('challFormulaireDesactive.ejs');
}

function loadChallengeXSSReflechi(req, res) {
    var object = {containerServerAlreadyRunning:false, containerServerAlreadyCreated:false, containerBDDAlreadyRunning:false, containerBDDAlreadyCreated:false, portServeur:""};
    var idChallenge = req.params.idChallenge;
    var nomConteneurServeur = req.user.identifiant + '_' + idChallenge;
    var nomImageServeur = "challengexssreflechi_image";

    async.series([
        // Vérification que le conteneur n'a pas déjà été lancé (Serveur Web)
        function(callback) {
            inspect(callback, nomConteneurServeur, object, 0);
        },
        // Si le conteneur a déjà été créé mais est stoppé (Serveur)
        function(callback) {
            removeContainer(callback, nomConteneurServeur, res, object, 0);
        },
        // Lancement conteneur si le conteneur n'a pas été créé (Serveur)
        function(callback) {
            runContainerServeur(callback, nomConteneurServeur, nomImageServeur, res, object);
        },
        // Récupération du port où le conteneur tourne (Serveur)
        function(callback) {
            getPortContainer(callback, nomConteneurServeur, res, object);
        },
        // Attente que le conteneur (Serveur) soit prêt
        function(callback) {
            waitForContainerServeur(callback, object.portServeur);
        }
    ], function(err) { //This function gets called after all the tasks have called their "task callbacks"
        if (err) {
            return next(err);
        }
        res.status(200).send({port: object.portServeur, adresse: config.host});
    });
}

function loadChallengeCRLF(req, res) {
    res.render('challCRLF.ejs');
}

function loadChallengeUpload(req, res) {
    var object = {containerServerAlreadyRunning:false, containerServerAlreadyCreated:false, containerBDDAlreadyRunning:false, containerBDDAlreadyCreated:false, portServeur:""};
    var idChallenge = req.params.idChallenge;
    var nomConteneurServeur = req.user.identifiant + '_' + idChallenge;
    var nomImageServeur = "challengeupload_image";

    async.series([
        // Vérification que le conteneur n'a pas déjà été lancé (Serveur Web)
        function(callback) {
            inspect(callback, nomConteneurServeur, object, 0);
        },
        // Si le conteneur a déjà été créé mais est stoppé (Serveur)
        function(callback) {
            removeContainer(callback, nomConteneurServeur, res, object, 0);
        },
        // Lancement conteneur si le conteneur n'a pas été créé (Serveur)
        function(callback) {
            runContainerServeur(callback, nomConteneurServeur, nomImageServeur, res, object);
        },
        // Récupération du port où le conteneur tourne (Serveur)
        function(callback) {
            getPortContainer(callback, nomConteneurServeur, res, object);
        },
        // Attente que le conteneur (Serveur) soit prêt
        function(callback) {
            waitForContainerServeur(callback, object.portServeur);
        }
    ], function(err) { //This function gets called after all the tasks have called their "task callbacks"
        if (err) {
            return next(err);
        }
        res.status(200).send({port: object.portServeur, adresse: config.host});
    });
}

function loadChallengeXSSStockee(req, res) {
    var object = {containerServerAlreadyRunning:false, containerServerAlreadyCreated:false, containerBDDAlreadyRunning:false, containerBDDAlreadyCreated:false, containerSeleniumAlreadyRunning: false, containerSeleniumAlreadyCreated: false, containerCronAlreadyCreated: false, containerCronAlreadyRunning: false,portServeur:""};
    var idChallenge = req.params.idChallenge;
    var nomConteneurServeur = req.user.identifiant + '_' + idChallenge;
    var nomConteneurSelenium = nomConteneurServeur + '_selenium';
    var nomConteneurBDD = nomConteneurServeur + '_db';
    var nomConteneurCron = nomConteneurServeur + '_cron';
    var nomImageServeur = "challengexssstocke_image";
    var nomImageBDD = "challengexssstocke_db_image";

    async.series([
        // Vérification que le conteneur n'a pas déjà été lancé (Serveur Web)
        function(callback) {
            console.log(object);
            inspect(callback, nomConteneurServeur, object, 0);
        },
        // Vérification que le conteneur n'a pas déjà été lancé (BDD)
        function(callback) {
            inspect(callback, nomConteneurBDD, object, 1);
        },
        // Vérification que le conteneur n'a pas déjà été lancé (Selenium)
        function(callback) {
            inspect(callback, nomConteneurSelenium, object, 2);
        },
        // Vérification que le conteneur n'a pas déjà été lancé (Cron)
        function(callback) {
            inspect(callback, nomConteneurCron, object, 3);
        },
        // Si le conteneur a déjà été créé mais est stoppé (Serveur)
        function(callback) {
            removeContainer(callback, nomConteneurServeur, res, object, 0);
        },
        // Si le conteneur a déjà été créé mais est stoppé (BDD)
        function(callback) {
            removeContainer(callback, nomConteneurBDD, res, object, 1);
        },
        // Si le conteneur a déjà été créé mais est stoppé (Selenium)
        function(callback) {
            removeContainer(callback, nomConteneurSelenium, res, object, 2);
        },
        // Si le conteneur a déjà été créé mais est stoppé (Cron)
        function(callback) {
            removeContainer(callback, nomConteneurCron, res, object, 3);
        },
        // Lancement conteneur si le conteneur n'a pas été créé (BDD)
        function(callback) {
            runContainerBDD(callback, nomConteneurBDD, nomImageBDD, res, object);
        },
        // Lancement du serveur Selenium
        function(callback) {
            runSeleniumContainer(callback, nomConteneurSelenium, res, object);
        },
        // Lancement conteneur si le conteneur n'a pas été créé (Serveur)
        function(callback) {
            runContainerServeurLinkedBDD(callback, nomConteneurServeur, nomConteneurBDD, nomImageServeur, res, object);
        },
        // Récupération du port où le conteneur tourne (Serveur)
        function(callback) {
            getPortContainer(callback, nomConteneurServeur, res, object);
        },
        // Lancement du serveur cron
        function(callback) {
            runCronServeur(callback, object.portServeur,  nomConteneurCron, nomConteneurSelenium, res, object);
        },
        // Attente que le conteneur (Serveur) soit prêt
        function(callback) {
            waitForContainerServeur(callback, object.portServeur);
        },
        // Attente que le conteneur (BDD) soit prêt
        function(callback) {
            waitForContainerBDD(callback, nomConteneurBDD, res);
        }
    ], function(err) { //This function gets called after all the tasks have called their "task callbacks"
        if (err) {
            return next(err);
        }
        console.log(object.portServeur);
        res.status(200).send({port: object.portServeur, adresse: config.host});
    });
}

var self = module.exports = {
    run: function (req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        challengesModel.getOrdreFromId(idChallenge, function(ordreChallenge, error) {
            if (error == null) {
                utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
                   if (error == null) {
                       challengesModel.getIndiceChallenge(idChallenge, function(indice, error) {
                           if (error == null) {
                               challengesModel.getNomChallenge(idChallenge, function(nom, error) {
                                  if (error == null) {
                                      challengesModel.getDescription(idChallenge, function(description, error) {
                                         if (error == null) {
                                             if (idChallenge == 4 || idChallenge == 6 || idChallenge == 10 || idChallenge == 11 || idChallenge == 12) {
                                                 res.render('challenge.ejs', {
                                                     idChallenge: idChallenge,
                                                     nomChallenge: nom,
                                                     validate: validatedBoolean,
                                                     indice: indice,
                                                     description: description,
                                                     docker: true
                                                 });
                                             }
                                             else {
                                                 res.render('challenge.ejs', {
                                                     idChallenge: idChallenge,
                                                     nomChallenge: nom,
                                                     validate: validatedBoolean,
                                                     indice: indice,
                                                     description: description
                                                 });
                                             }
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
    checkFlagAndInsert: function(req, res) {
        var flag = req.body.flag;
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        challengesModel.validateFlag(idChallenge, flag, function (flagBoolean, error) {
            if (error == null) {
                if (flagBoolean) {
                    // Le flag est le bon, on vérifie si c'est la première fois que l'utilisateur le valide, si oui on dit que l'utilisateur l'a validé à la bdd
                    utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
                        if (error == null) {
                            if (validatedBoolean) {
                                res.status(200).json({
                                    flag: true
                                });
                            }
                            else {
                                utilisateurModel.validateChallenge(identifiant, idChallenge, function(error) {
                                    if (error == null) {
                                        res.status(200).json({
                                            flag: true
                                        });
                                    }
                                    else {
                                        console.log("Erreur : " + error);
                                        res.status(500).send(error);
                                    }
                                })
                            }
                        }
                        else {
                            console.log("Erreur : " + error);
                            res.status(500).send(error);
                        }
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
    },
    isChallengeValidated: function(req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
            if (error == null) {
                if (validatedBoolean) {
                    res.status(200).json({
                        challengeValidated: true
                    });
                }
                else {
                    res.status(200).json({
                        challengeValidated: false
                    });
                }
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        })
    },
    getSolutionsOfChallenge: function(req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        utilisateurModel.isChallengeValidated(identifiant, idChallenge, function(validatedBoolean, error) {
            if (error == null) {
                if (validatedBoolean) {
                    challengesModel.getSolutionsOfChallenge(idChallenge, function(data, error) {
                        if (error == null) {
                            // Mise en forme de la solution

                            var solution = "<textarea class=\"form-control rounded-0\" id=\"exampleFormControlTextarea1\" rows=\"12\">";
                            solution += escapeHtml(data[0].solution);
                            solution += "</textarea>";

                            for (var i = 0; i < data[1].length; i++) {
                                solution += '<br>';
                                solution += escapeHtml(data[1][i].identifiant + ' propose : ');
                                solution += "<textarea class=\"form-control rounded-0\" id=\"exampleFormControlTextarea1\" rows=\"12\">";
                                solution += escapeHtml(data[1][i].solution);
                                solution += "</textarea>";
                            }
                            res.status(200).send(solution);
                        }
                        else {
                            console.log("Erreur : " + error);
                            res.status(500).send(error);
                        }
                    });
                }
                else {
                    res.status(200).json({
                        erreur: "Il faut d'abord valider le challenge pour avoir accès à la solution !"
                    });
                }
            }
            else {
                console.log("Erreur : " + error);
                res.status(500).send(error);
            }
        })
    },
    proposeSolution : function(req, res) {
        var idChallenge = req.params.idChallenge;
        var identifiant = req.user.identifiant;
        var solution = escapeHtml(req.body.solution);
        if (solution != "") {
            utilisateurModel.isChallengeValidated(identifiant, idChallenge, function (validatedBoolean, error) {
                if (error == null) {
                    if (validatedBoolean) {
                        utilisateurModel.setSolutionChallenge(identifiant, idChallenge, solution, function (error) {
                            if (error == null) {
                                res.status(200).json({});
                            }
                            else {
                                console.log("Erreur : " + error);
                                res.status(500).send(error);
                            }
                        });
                    }
                }
                else {
                    console.log("Erreur : " + error);
                    res.status(500).send(error);
                }
            });
        }
        else {
            console.log("Solution vide");
            res.status(500).send(error);
        }
    },
    loadingPageChallenge : function(req, res) {
        var idChallenge = req.params.idChallenge;
        // Challenges qui nécessitent Docker
        if (idChallenge == 4) {
            res.render('loading.ejs', {idChallenge: idChallenge});
        }
        // Offuscation
        if (idChallenge == 7) {
            loadChallengeOffuscation(req, res);
        }
        // Formulaire bloqué : champs vides
        if (idChallenge == 5) {
            loadChallengeFormulaireBloque(req, res);
        }
        // Formulaire bloqué : bouton désactivé
        if (idChallenge == 8) {
            loadChallengeFormulaireDesactive(req, res);
        }
        // XSS réléchi
        if (idChallenge == 6) {
            res.render('loading.ejs', {idChallenge: idChallenge});
        }
        // CRLF
        if (idChallenge == 9) {
            loadChallengeCRLF(req, res);
        }
        // Upload
        if (idChallenge == 10) {
            res.render('loading.ejs', {idChallenge: idChallenge});
        }
        // XSS stockée
        if (idChallenge == 11) {
            res.render('loading.ejs', {idChallenge: idChallenge});
        }
    },
    // Stop les conteneurs et en relance de nouveau
    resetChallenge: function(req, res) {
        var idChallenge = req.params.idChallenge;
        var nomConteneurServeur = req.user.identifiant + '_' + idChallenge;
        var nomConteneurBDD;
        if (idChallenge == 4 || idChallenge == 11) {
            nomConteneurBDD = nomConteneurServeur + '_db';
        }
        stopAndRemoveContainer(nomConteneurServeur, res, function (error) {
            if (error == null) {
                if (typeof nomConteneurBDD != "undefined") {
                    stopAndRemoveContainer(nomConteneurBDD, res, function (error) {
                        if (error == null) {
                            // Stop and remove cron !!!
                            self.loadingPageChallenge(req, res);
                        }
                        else {
                            res.render('error.ejs', {message: error, error: error});
                        }
                    });
                }
                else {
                    self.loadingPageChallenge(req, res);
                }
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    },
    // Redirection vers la bonne fonction de chargement du challenge
    loadChallenge : function(req, res) {
        var idChallenge = req.params.idChallenge;
        // Become an admin
        if (idChallenge == 4) {
            loadChallengeSQL(req, res);
        }
        // XSS réfléchi
        if (idChallenge == 6) {
            loadChallengeXSSReflechi(req, res);
        }
        // File Uploads
        if (idChallenge == 10) {
            loadChallengeUpload(req, res);
        }
        //
        if (idChallenge == 11) {
            loadChallengeXSSStockee(req, res);
        }
    }
}