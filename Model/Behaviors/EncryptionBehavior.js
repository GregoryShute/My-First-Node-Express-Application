var knex = require('../Database/knex');
var Promise = require('bluebird');
var crypto = require('crypto');
var LookupBehavior = require('./LookupBehavior');
var LB = LookupBehavior;

var EncryptionBehavior = {

    createSalt() {

        return crypto.randomBytes(32).toString('hex');

    },

    createHash(password) {

        return crypto.createHash('sha256').update(password).digest('hex');

    },

    checkPassword(person, password) {

        var hashed_password_salt = EncryptionBehavior.getSecretCredentials(person);
        var hashed_password = hashed_password_salt[0];
        var salt = hashed_password_salt[1];
        var input_password_hashed = EncryptionBehavior.createHash(password + salt);

        if (EncryptionBehavior.compareHashes(hashed_password, input_password_hashed)) {

            return true;

        } else {

            return false;

        }

    },

    compareHashes(hashed_password, input_password_hashed) {

        if (hashed_password === input_password_hashed) {

            return true;

        } else {

            return false;

        }

    },

    getHashedPassword(password, salt) {

        return EncryptionBehavior.createHash(password + salt);

    },

    getSecretCredentials(person) {

        if (person) {

            var salt = person[0].salt;
            var hashed_password = person[0].hashed_password; // have to be careful when changing database types
            return [hashed_password, salt];

        } else {

            return [];

        }

    },

    getSaltByPersonPassword(password, person_id) {

        return Promise.coroutine(function* () { //new Promise? coroutine is lowcase so I odn't think so

            var person = yield LB.getPersonById(person_id);
            var ok_password = EncryptionBehavior.checkPassword(person, password);

            if (ok_password) {

                return person[0].salt;

            } else {

                return null;

            }

        })()
            .then(function (salt) {

                return salt;

            })
            .catch(function (e) {

                console.error(e);

                return null;

            });

    },

    updatePassword(person_id, new_hashed_password) {

        return knex('people')
            .where('person_id', person_id)
            .update({

                hashed_password: new_hashed_password //have to check on this because the database variable names need to be changed
            
            })
            .return(true)
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },
    
    //need to make sure the password is ok (appropriate)
    changePassword(person_id, old_password, new_password) {


        return Promise.coroutine(function* () {

            var salt = yield EncryptionBehavior.getSaltByPersonPassword(old_password, person_id);
            var new_hashed_password = EncryptionBehavior.createHash(new_password + salt);
            var password_updated = yield EncryptionBehavior.updatePassword(person_id, new_hashed_password);

            return password_updated;

        })()
            .then(function (password_updated) {

                return password_updated;

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });


    },

    getPersonByCredentials(username, password) {

        return Promise.coroutine(function* () {

            var person = yield LB.getPersonByUsername(username);
            var ok_password = EncryptionBehavior.checkPassword(person, password);

            if (ok_password) {

                return person;

            } else {

                return null;

            }

        })()
            .then(function (person) {

                return person;

            })
            .catch(function (e) {

                console.error(e);

                return null;

            });

    }

};




module.exports = EncryptionBehavior;
