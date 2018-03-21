var coursModel = require('../models/cours');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        var idUnite = req.params.idUnite;
        coursModel.getMenuCours(idUnite, function(data, error) {
            if (error == null) {
                coursModel.getOrdreFromIdUnite(idUnite, function(ordreUnite, error) {
                    if (error == null) {
                        res.render('menuCours.ejs', {data: data, idUnite: idUnite, ordreUnite: ordreUnite});
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
}