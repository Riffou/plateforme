module.exports = {
    run: function(req, res) {
        var cours = 'unite' + req.params.numeroUnite + '_' + req.params.numeroPartie + '.ejs';
        var precedent = "", suivant = "", lu = "";

        // Check if previous button is needed
        if (req.params.numeroPartie == 2) {
            precedent = "<button class=\"btn\">\n" +
                "        <span class=\"oi oi-chevron-left\"></span>\n" +
                "        Cours précédent\n" +
                "    </button>";
        }

        // Check if next button is needed
        if (req.params.numeroPartie <= 2) {
            suivant = "<button class=\"btn float-right\">\n" +
                "        Cours suivant\n" +
                "        <span class=\"oi oi-chevron-right space-left\"></span>\n" +
                "    </button>";
        }

        // Check if user read the lesson
        lu = "<button class=\"btn\">\n" +
            "        J'ai lu ce cours\n" +
            "        <span class=\"oi oi-check\"></span>\n" +
            "    </button>";

        // render the view
        res.render(cours, {precedent: precedent,
                           suivant: suivant,
                           lu: lu});
    }
}