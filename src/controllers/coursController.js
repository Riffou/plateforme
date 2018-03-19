var coursModel = require('../models/cours');

module.exports = {
    run: function(req, res) {
        var numeroUnite = req.params.numeroUnite;
        var numeroCours = req.params.numeroCours;
        var precedent = "", suivant = "", lu = "";

        // Check if previous button is needed
        if (coursModel.hasPrevious(numeroCours)) {
            precedent = "<button class=\"btn\">\n" +
                "        <span class=\"oi oi-chevron-left\"></span>\n" +
                "        Cours précédent\n" +
                "    </button>";
        }

        // Check if user read the lesson
        lu = "<button class=\"btn\">\n" +
            "        J'ai lu ce cours\n" +
            "        <span class=\"oi oi-check\"></span>\n" +
            "    </button>";

        // Check if next button is needed
        coursModel.hasNext(numeroUnite, numeroCours, function (data, error) {
            if (data == true) {
                console.log("Tu as un suivant !");
                suivant = "<button class=\"btn float-right\">\n" +
                    "        Cours suivant\n" +
                    "        <span class=\"oi oi-chevron-right space-left\"></span>\n" +
                    "    </button>";
            }
            // render the view
            res.render('cours.ejs', {
                precedent: precedent,
                suivant: suivant,
                lu: lu,
                numeroUnite: numeroUnite,
                numeroCours: numeroCours
            });
        });
    }
}