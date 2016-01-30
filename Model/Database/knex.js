var postgresUrl = 'postgres://localhost:5432/testdb';

function initKnex(){
    
    var knex;

    knex = require('knex')({
        
        client: 'pg',
        connection: postgresUrl,
        pool: {
            min: 1,
            max: 10
        },
        debug: true
        
    });
    
    return knex;  
    
};

var makeKnex = initKnex();

module.exports = makeKnex;