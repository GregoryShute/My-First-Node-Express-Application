var knex = require('../Database/knex');
var SearchBehaviorMotor = require('../BehaviorMotors/SearchBehaviorMotor');
var SBM = SearchBehaviorMotor;

var SearchBehavior = {


    getUsernamesByRegex(query) {

        if(!SBM.sanitize(query)){
           
            return null;
            
        };
        
        var regex = '^' + query;

        return knex.raw('select * from people where username ~* ?', [regex])
            .then(function (raw_results) {

                return raw_results.rows;

            })
            .map(function (row) {

                return row.username;

            })
            .then(function(usernames){
                
                return {query_results: usernames };
                
            })
            .catch(function (e) {

                console.error(e);

                return null;

            });
    }

};


module.exports = SearchBehavior;
