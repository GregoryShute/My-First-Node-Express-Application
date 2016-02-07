var postgresUri = require('./connectionString');

function initKnex(){
    
    var knex;

    knex = require('knex')({
        
        client: 'pg',
        connection: postgresUri,
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