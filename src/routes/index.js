var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.render('home.ejs');
});

router.get('/cours/', function(req, res) {
    res.render('cours.ejs');
});

router.get('/cours/:numeroUnite', function(req, res) {
    var unite = 'unite' + req.params.numeroUnite + '.ejs';
    res.render(unite);
});

router.get('/challenges/', function(req, res) {
    res.render('challenges.ejs');
});

router.get('/faq/', function(req, res) {
    res.render('faq.ejs');
});

module.exports = router;
