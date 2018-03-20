var challengesModel = require('../models/challenges');

module.exports = {
    run: function (req, res) {
        // Retrieve data from DB
        challengesModel.getChallenge(function(data, error) {
            if (error == null) {
                // render the view
                res.render('challenge.ejs', {data: data});
            }
            else {
                res.render('error.ejs', {message: error, error: error});
            }
        });
    }
}