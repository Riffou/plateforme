var coursModel = require('../models/cours');

module.exports = {
    content: null,
    run: function (req, res) {
        var idUnite = req.params.idUnite;
        var idCours = req.params.idCours;
        this.content = {};
        var self = this;

        // Check if lesson exists
        coursModel.doesLessonExist(idCours, function (exists, error) {
            if (error == null) {
                if (exists) {
                    // get the html for the buttons
                     self.getButtons(idUnite, idCours, function() {
                         coursModel.getOrdreFromIdUnite(idUnite, function(ordreUnite, error) {
                            if (error == null) {
                                coursModel.getOrdreFromIdCours(idCours, function(ordreCours, error) {
                                   if (error == null) {
                                       // render the view
                                       res.render('cours.ejs', {
                                           precedent: self.content.precedent,
                                           suivant: self.content.suivant,
                                           lu: self.content.lu,
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
    },
    getButtons: function(idUnite, idCours, callback) {
        var self = this;
        // Check if previous button is needed
        coursModel.getPrevious(idUnite, idCours, function(idPrevious, error) {
            if (error == null) {
                if (idPrevious) {
                    self.content.precedent = "<a class=\"btn btn-outline-secondary\" href=\"/unites/" +
                        idUnite + "/" + idPrevious + "\">" +
                        "        <span class=\"oi oi-chevron-left\"></span>\n" +
                        "        Cours précédent\n" +
                        "    </a>";
                }
                // Check if next button is needed
                coursModel.getNext(idUnite, idCours, function (idNext, error) {
                    if (error == null) {
                        if (idNext) {
                            self.content.suivant = "<a class=\"btn btn-outline-secondary float-right\" href=\"/unites/" +
                                idUnite + "/" + idNext + "\">" +
                                "        <span class=\"oi oi-chevron-right\"></span>\n" +
                                "        Cours suivant\n" +
                                "    </a>";
                        }
                        // Check if user has read the lesson
                        self.content.lu = "<button class=\"btn btn-outline-secondary\">\n" +
                            "        J'ai lu ce cours\n" +
                            "        <span class=\"oi oi-check\"></span>\n" +
                            "    </button>";
                        callback();
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
}