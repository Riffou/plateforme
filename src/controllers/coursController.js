var coursModel = require('../models/cours');

module.exports = {
    content: null,
    run: function (req, res) {
        var idUnite = req.params.idUnite;
        var idCours = req.params.idCours;
        this.content = {};
        var self = this;

        // Check if lesson exists
        coursModel.doesLessonExist(idUnite, idCours, function (exists, error) {
            if (error == null) {
                if (exists) {
                    // get the html for the buttons
                     self.getButtons(idUnite, idCours, function() {
                         // render the view
                         res.render('cours.ejs', {
                             precedent: self.content.precedent,
                             suivant: self.content.suivant,
                             lu: self.content.lu,
                             idUnite: idUnite,
                             idCours: idCours
                         });
                     });
                }
                else {
                    res.render('404.ejs');
                }
            }
        });
    },
    getButtons: function(idUnite, idCours, callback) {
        var self = this;
        // Check if previous button is needed
        if (coursModel.hasPrevious(idCours)) {
            self.content.precedent = "<a class=\"btn btn-outline-secondary\" href=\"/unites/" +
                idUnite + "/cours/" + (parseInt(idCours) - 1) + "\">" +
                "        <span class=\"oi oi-chevron-left\"></span>\n" +
                "        Cours précédent\n" +
                "    </a>";
        }

        // Check if user has read the lesson
        this.content.lu = "<button class=\"btn btn-outline-secondary\">\n" +
            "        J'ai lu ce cours\n" +
            "        <span class=\"oi oi-check\"></span>\n" +
            "    </button>";

        // Check if next button is needed
        coursModel.hasNext(idUnite, idCours, function (hasNextBoolean, error) {
            if (error == null) {
                if (hasNextBoolean) {
                    self.content.suivant = "<a class=\"btn btn-outline-secondary float-right\" href=\"/unites/" +
                        idUnite + "/cours/" + (parseInt(idCours) + 1) + "\">" +
                        "        <span class=\"oi oi-chevron-right\"></span>\n" +
                        "        Cours suivant\n" +
                        "    </a>";
                }
            }
        callback();
        });
    }
}