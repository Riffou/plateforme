var coursModel = require('../models/cours');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        coursModel.getMenuCours(req.params.numeroUnite, function(data, error) {
            if (error == null) {
                // render the view
                res.render('menuCours.ejs', {data: data, numeroUnite: req.params.numeroUnite});
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}