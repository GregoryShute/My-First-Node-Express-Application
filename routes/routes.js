var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

var HomePageController = require('../Model/Pages/HomePage');
var SearchPageController = require('../Model/Pages/SearchPage');
var SettingsPageController = require('../Model/Pages/SettingsPage');
var SignInPageController = require('../Model/Pages/SignInPage');
var SignOutPageController = require('../Model/Pages/SignOutPage');
var SignUpPageController = require('../Model/Pages/SignUpPage');


module.exports = function (app, passport) {

    app.set('view engine', 'ejs');
   

    //Index

    app.get('/', function (req, res) {
        
        res.render('index', {

            isAuthenticated: req.isAuthenticated(),

        });

    });

    app.post('/', function (req, res) {

        res.render('index');

    });


    //SignUp

    app.get('/signup', function (req, res) {

        var session = { person_id: null, username: null };

        SignUpPageController.loadSession(session, res);
        SignUpPageController.onRender();

    });

    app.post('/signup', function (req, res) {

        var session = { person_id: null, username: null };

        var order = JSON.parse(req.body.order);

        SignUpPageController.loadSession(session, res);
        SignUpPageController.onRequest(order);

    });


    //SignIn

    app.get('/signin', function (req, res) {
        
        if (req.isAuthenticated()) {

            res.redirect('/home');

        } else {

            var session = { person_id: null, username: null };

            SignInPageController.loadSession(session, res);
            SignInPageController.onRender();

        }
        
    });

    app.post('/signin', passport.authenticate('local', { failureRedirect: '/', successRedirect: '/home' }));


    //SignOut

    app.get('/signout', function (req, res) {
        
        if (req.isAuthenticated()) {
            
            res.render('SignOutPage');
            
        } else {
            
            res.redirect('/');
            
        }
        
    });

    app.post('/signout', function (req, res) {
        
        if (req.isAuthenticated()) {
            
            req.logout();
            res.redirect('/');
            
        } else {
            
            res.redirect('/');
            
        }
        
    });


    //Settings

    app.get('/settings', function (req, res) {

        if (req.isAuthenticated()) {

            var session = { person_id: req.user.person_id, username: req.user.username };

            SettingsPageController.loadSession(session, res);
            SettingsPageController.onRender();

        } else {

            res.redirect('/');

        }

    });

    app.post('/settings', function (req, res) {

        if (req.isAuthenticated()) {

            var session = { person_id: req.user.person_id, username: req.user.username };

            var order = JSON.parse(req.body.order);

            SettingsPageController.loadSession(session, res);
            SettingsPageController.onRequest(order);

        } else {

            res.redirect('/');

        }

    });


    //Home
    
    app.get('/home', function (req, res) {

        if (req.isAuthenticated()) {

            var session = { person_id: req.user.person_id, username: req.user.username };

            HomePageController.loadSession(session, res);
            HomePageController.onRender();

        } else {

            res.redirect('/');

        }

    });

    app.post('/home', function (req, res) {

        if (req.isAuthenticated()) {

            var session = { person_id: req.user.person_id, username: req.user.username };

            var order = JSON.parse(req.body.order);

            HomePageController.loadSession(session, res);
            HomePageController.onRequest(order);

        } else {

            res.redirect('/');

        }

    });
    
    
    //Search

    app.get('/search', function (req, res) {

        if (req.isAuthenticated()) {

            var session = { person_id: req.user.person_id, username: req.user.username };

            SearchPageController.loadSession(session, res);
            SearchPageController.onRender();

        } else {

            res.redirect('/');

        }

    });

    app.post('/search', function (req, res) {

        if (req.isAuthenticated()) {

            var session = { person_id: req.user.person_id, username: req.user.username };

            var order = JSON.parse(req.body.order);

            SearchPageController.loadSession(session, res);
            SearchPageController.onRequest(order);

        } else {

            res.redirect('/');

        }

    });


};