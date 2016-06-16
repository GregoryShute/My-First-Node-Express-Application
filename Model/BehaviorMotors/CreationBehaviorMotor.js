var knex = require('../Database/knex');
var Promise = require('bluebird');


var CreationBehaviorMotor = {

    insertUserT(username, hashed_password, salt, email, password, privacy) {

        return knex.transaction(function (trx) {

            CreationBehaviorMotor.savePersonTransaction(username, hashed_password, salt, privacy, trx)
                                 .then(function(person_id){

                                     return CreationBehaviorMotor.saveEmailTransaction(email, person_id, trx);
                                     
                                 })
                                 .then(trx.commit)
                                 .catch(trx.rollback);
                                 
        })
        .then(function(){
            
            return true;
            
        })
        .catch(function(e){
            
            console.error(e);
            
            return false;
            
        })
    },
            

    savePersonTransaction(username, hashed_password, salt, privacy, trx) {

        return trx.insert({ username: username, hashed_password: hashed_password, salt: salt, privacy: privacy }, 'person_id')
                    .into('people')
                    .transacting(trx)

    },

    saveEmailTransaction(email, person_id, trx) {

        return trx.insert({ person_id: person_id[0], address: email }, 'email_id')
                    .into('emails')
                    .transacting(trx)

    },


    areAppropriateStrings(username, email, password) {
        
        return true;

        // var usernameLength = username.length;

        // var emailLength = email.length;
        // var passwordLength = password.length;

        // if (usernameLength > 2 && usernameLength < 21) {
        //     for (var i = 0, len = usernameLength; i < len; i++) {
        //         if (!isUsernameCharValid(username.toLowerCase().charCodeAt(i))) {

        //             return false;
        //         }
        //     }
        // } else { return false; }

        // if (emailLength > 4 && emailLength < 41) {
        //     var at = 0;
        //     if (email.charCodeAt(0) === 64 || email.charCodeAt(emailLength - 1) === 64) {
        //         return false;
        //     }
        //     for (var i = 0, len = emailLength; i < len; i++) {
        //         if (email.charCodeAt(i) === 64) {
        //             at++;
        //         }
        //         if (!isEmailCharValid(email.toLowerCase().charCodeAt(i))) {

        //             return false;
        //         }
        //     }
        //     if (at !== 1) {
        //         return false;
        //     } else {
        //         return true;
        //     }
        // } else { return false; }

        // if (passwordLength > 9 && passwordLength < 61) {
        //     for (var i = 0, len = passwordLength; i < len; i++) {
        //         if (!isPasswordCharValid(password.charCodeAt(i))) {
        //             return false;
        //         }
        //     }
        // } else { return false; }

        // return true;

        // function isUsernameCharValid(charCode) {
        //     if (charCode > 96 && charCode < 123) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // };

        // function isEmailCharValid(charCode) {
        //     if ((charCode > 96 && charCode < 123) || (charCode === 64) || (charCode === 46)) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // };

        // function isPasswordCharValid(charCode) {
        //     if (charCode > 65 && charCode < 91 || charCode > 96 && charCode < 123) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // };
    }



};





module.exports = CreationBehaviorMotor;
