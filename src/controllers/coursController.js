var coursModel = require('../models/cours');

var getButtons = function(idUnite, idCours, callback) {
    var precedent = "", suivant = "", lu = "";
    // Check if previous button is needed
    coursModel.getPrevious(idUnite, idCours, function(idPrevious, error) {
        if (error == null) {
            if (idPrevious) {
                precedent = "<a class=\"btn btn-outline-secondary\" href=\"/unites/" +
                    idUnite + "/" + idPrevious + "\">" +
                    "        <span class=\"oi oi-chevron-left\"></span>\n" +
                    "        Cours précédent\n" +
                    "    </a>";
            }
            // Check if next button is needed
            coursModel.getNext(idUnite, idCours, function (idNext, error) {
                if (error == null) {
                    if (idNext) {
                        suivant = "<a class=\"btn btn-outline-secondary float-right\" href=\"/unites/" +
                            idUnite + "/" + idNext + "\">" +
                            "        <span class=\"oi oi-chevron-right\"></span>\n" +
                            "        Cours suivant\n" +
                            "    </a>";
                    }
                    // Check if user has read the lesson
                    lu = "<button class=\"btn btn-outline-secondary\">\n" +
                        "        J'ai lu ce cours\n" +
                        "        <span class=\"oi oi-check\"></span>\n" +
                        "    </button>";
                    callback(precedent, suivant, lu);
                }
                else {
                    console.log(error);
                }
            });
        }
        else {
            console.log(error);
        }
    });
}

module.exports = {
    run: function (req, res) {
        var idUnite = req.params.idUnite;
        var idCours = req.params.idCours;

        // Check if lesson exists
        coursModel.doesLessonExist(idCours, function (exists, error) {
            if (error == null) {
                if (exists) {
                    // get the html for the buttons
                    getButtons(idUnite, idCours, function (precedent, suivant, lu) {
                        coursModel.getOrdreFromIdUnite(idUnite, function (ordreUnite, error) {
                            if (error == null) {
                                coursModel.getOrdreFromIdCours(idCours, function (ordreCours, error) {
                                    if (error == null) {
                                        // render the view
                                        res.render('cours.ejs', {
                                            precedent: precedent,
                                            suivant: suivant,
                                            lu: lu,
                                            ordreUnite: ordreUnite,
                                            idUnite: idUnite,
                                            ordreCours: ordreCours
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
                    });
                }
                else {
                    res.render('404.ejs');
                }
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}