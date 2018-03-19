module.exports = {
    run: function (req, res) {
        // render the view
        var unite = 'unite' + req.params.numeroUnite + '.ejs';
        res.render(unite);
    }
}