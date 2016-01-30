var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');

module.exports = function (app) {

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.use(expressSession({
        
        resave: false,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET || 'replace this string with secret'
        
    }));
    
    app.use(passport.initialize());
    app.use(passport.session());
    
    return app;
    
};