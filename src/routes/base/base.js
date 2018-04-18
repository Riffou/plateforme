module.exports = {
    requireLogin: function (req, res, next) {
        // Lignes à retirer si connexion pas automatique
        req.user = {};
        req.user.identifiant = "nicolas";
        req.user.email = "nicolas@hotmail.fr";

        if (!req.user) {
            res.redirect('/connexion');
        } else {
            next();
        }
    },
    isAlreadyLogged(req, res, next) {
        if (req.user) {
            res.redirect('/');
        }
        else {
            next();
        }
    }
}