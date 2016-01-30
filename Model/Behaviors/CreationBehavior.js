var CreationBehaviorMotor = require('../BehaviorMotors/CreationBehaviorMotor');
var EncryptionBehavior = require('./EncryptionBehavior');
var LookupBehavior = require('./LookupBehavior');
var Promise = require('bluebird');

var CBM = CreationBehaviorMotor;
var EB = EncryptionBehavior;
var LB = LookupBehavior;


var CreationBehavior  = {

    createUser(username, password, email, privacy) {
        
        return Promise.coroutine(function* () {

            var salt, hashed_password;
            var valid_credentials = CBM.areAppropriateStrings(username, email, password);

            var existing_credentials = yield Promise.props({

                existing_email: LB.isEmail(email),
                existing_username: LB.isUsername(username)

            });
            
            var existing_credential_omit_pw = (existing_credentials.existing_email || existing_credentials.existing_username);

            if (valid_credentials && !(existing_credential_omit_pw)) {

                salt = EB.createSalt();
                hashed_password = EB.createHash(password + salt);

            } else {

                return false;

            }

                var user_created = yield CBM.insertUserT(username, hashed_password, salt, email, privacy);

                return user_created;

        })()
            .then(function (user_created) {

                return user_created;

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },

};





module.exports = CreationBehavior;