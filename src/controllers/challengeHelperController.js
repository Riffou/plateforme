module.exports = {
    checkEmptyInputs : function (req, res) {
        var identifiant = req.body.identifiantInput;
        var email = req.body.emailInput;
        var password = req.body.passwordInput;
        // Si aucun champ n'est vide
        if (identifiant != "" && email != "" && password != "") {
            res.render('chall3.ejs', {erreur: "Bravo vous venez de créer un compte !"});
        }
        // Sinon : l'utililsateur a réussi le challenge
        else {
            res.render('chall3Success.ejs');
        }
    },
    successDisabledButton : function (req, res) {
        res.render('chall4Success.ejs');
    }
}