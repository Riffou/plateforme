function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = {
    checkEmptyInputs : function (req, res) {
        var identifiant = req.body.identifiantInput;
        var email = req.body.emailInput;
        var password = req.body.passwordInput;
        // Si aucun champ n'est vide
        if (identifiant != "" && email != "" && password != "") {
            res.render('challFormulaireBloque.ejs', {erreur: "Bravo vous venez de créer un compte !"});
        }
        // Sinon : l'utililsateur a réussi le challenge
        else {
            res.render('challFormulaireBloqueSuccess.ejs');
        }
    },
    successDisabledButton : function (req, res) {
        res.render('challFormulaireDesactiveSuccess.ejs');
    },
    checkEmails: function(req, res) {
        var email = req.body.emailInput;
        var arrayOfEmails = email.split("%0A");
        if (arrayOfEmails) {
            if (arrayOfEmails[0] === "nicolas@lab-solutec.fr") {
                if (validateEmail(arrayOfEmails[1]) === true) {
                    res.render("challCRLFSuccess.ejs");
                }
                else {
                    res.render("challCRLF.ejs", {erreur: "Vous devez récupérer le mail de réinitialisation de nicolas@lab-solutec.fr !"})
                }
            }
            else {
                res.render("challCRLF.ejs", {erreur: "Vous devez récupérer le mail de réinitialisation de nicolas@lab-solutec.fr !"})
            }
        }
        else {
            res.render("challCRLF.ejs", {erreur: "Vous devez récupérer le mail de réinitialisation de nicolas@lab-solutec.fr !"})
        }
    }
}