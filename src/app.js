var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var index = require('./routes/index');
var api = require('./routes/api');
var challenges = require('./routes/challenges');
var cours = require('./routes/cours');
var profil = require('./routes/profil');
var admin = require('./routes/admin');

var app = express();

var utilisateurModel = require('./models/utilisateurs');
var administrateurModel = require('./models/administrateurs');

// view engine setup
app.set('views',  [path.join(__dirname, 'views'),
    path.join(__dirname, 'views/exemples/')]);

app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        cookieName: 'session',
        name:'session',
        secret: '9089981552b376a2fb6f447532ff9a8ffe099f6c614749821c834e196ff7757f6ee563bb902a55a5e8e8cfdc6dd0863f',
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        httpOnly: true,
        resave: false,
        saveUninitialized: false
}));

function userSession(req, callback) {
    utilisateurModel.userExists(req.session.user.identifiant, function (existsBoolean, error) {
        if (error == null) {
            if (existsBoolean) {
                req.user = req.session.user;
                callback(null);
            }
        }
        else {
            callback(error);
        }
    });
}

function adminSession(req, callback) {
    administrateurModel.userExists(req.session.admin.identifiant, function (existsBoolean, error) {
        if (error == null) {
            if (existsBoolean) {
                req.admin = req.session.admin;
                callback(null);
            }
        }
        else {
            callback(error);
        }
    });
}

app.use(function(req, res, next) {
    if (req.session) {
        if (req.session.user && req.session.admin) {
            userSession(req, function(error) {
                if (error == null) {
                    adminSession(req, function(error) {
                        if (error == null) {
                            next();
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
        else if (req.session.user) {
            userSession(req, function(error) {
                if (error == null) {
                    next();
                }
                else {
                    res.render('error.ejs', {message: error, error: error});
                }
            });
        }
        else if (req.session.admin) {
            adminSession(req, function(error) {
                if (error == null) {
                    next();
                }
                else {
                    res.render('error.ejs', {message: error, error: error});
                }
            });
        }
        else {
            next();
        }
    }
});

// Routes
app.use('/', index);
app.use('/api', api);
app.use('/profil', profil);
app.use('/challenges', challenges);
app.use('/unites', cours);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
 // set locals, only providing error in development
 res.locals.message = err.message;
 res.locals.error = req.app.get('env') === 'development' ? err : {};

 // render the error page
 res.status(err.status || 500);
 res.render('error.ejs', {erreurMessage:err.message});
});


module.exports = app;
