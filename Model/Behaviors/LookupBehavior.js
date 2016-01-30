var knex = require('../database/knex');

//Difference between lookup and search is a little gray.

var LookupBehavior = {
    

    getPersonByUsername(username) {

        return knex('people')
            .where({ username: username })
            .then(function (person) {

                return person;

            })
            .catch(function (e) {

                console.error(e);

                return null;

            });

    },


    getPersonById(person_id) {

        return knex('people')
            .where('person_id', person_id)
            .then(function (person) {

                return person;

            })
            .catch(function (e) {

                console.error(e);

                return null;

            });
            
    },
    

    getPersonByEmail(email) {

        return knex('emails')
            .where({ address: email })
            .then(function (person) {

                return person;

            })
            .catch(function (e) {

                console.error(e);

                return null;

            });

    },

  
    isEmail(email) { 

        return knex('emails')
            .where({ address: email })
            .then(function (email) {

                if (email.length !== 0) {

                    return true;

                } else {

                    return false;

                }

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });
    },

    isUsername(username) {

        return knex('people')
            .where({ username: username })
            .then(function (username) {

                if (username.length !== 0) {

                    return true;

                } else {

                    return false;

                }

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    }


};




module.exports = LookupBehavior;