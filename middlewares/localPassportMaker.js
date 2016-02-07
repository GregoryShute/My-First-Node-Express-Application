var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var crypto = require('crypto');

var LB = require('../Model/Behaviors/LookupBehavior');
var EB = require('../Model/Behaviors/EncryptionBehavior');

var Promise = require('bluebird');


module.exports = function (app) {


    //Authentication Using Passport
    //Passport takes care of creating unique session ids.
    passport.use(new passportLocal.Strategy(function (username, password, done) {

        var matchedId;
        var matchedUsername;
        var foundUser = false;

        Promise.coroutine(function* () {

            var user = yield EB.getPersonByCredentials(username, password);

            return user;

        })()
            .then(function (user) {

            if (user !== null && user !== undefined) {

                matchedId = user[0].person_id;
                matchedUsername = user[0].username;
                foundUser = true;

            }

            if (foundUser === true) {

                return done(null, { person_id: matchedId, username: matchedUsername });

            } else {

                return done(null, null);

            }

        })
            .catch(function (e) {

                console.log(e);

                return done(null, null);

            });

    }));


    //Makes a memento that can be restored upon request during an active session.
    passport.serializeUser(function (user, done) {

        return done(null, user.person_id);

    });

    //Restores the session object when there is a request.
    passport.deserializeUser(function (person_id, done) {

        var user;

        Promise.coroutine(function* () {

            user = yield LB.getPersonById(person_id);

            return user[0];

        })().then(function (user) {

            if (user !== null) {

                return done(null, { person_id: person_id, username: user.username });

            } else {

                return done(null, null);

            }
        })
            .catch(function (e) {

                console.log(e);

                return done(null, null)

            });
    });


    return passport;
}