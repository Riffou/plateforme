var coursModel = require('../models/cours');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        coursModel.getUnites(function(data, error) {
            if (error == null) {
                // render the view
                res.render('menuUnites.ejs', {data: data});
            }
            else {
                res.render('error.ejs', {message : error, error:error});
            }
        });
    }
}