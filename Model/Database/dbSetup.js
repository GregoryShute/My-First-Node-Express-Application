var postgresUrl = 'postgres://localhost:5432/testdb';

function setup() {

    knexSetup(createTables);

    var knex;
    function knexSetup(finished) {
        knex = require('knex')({
            client: 'pg',
            connection: postgresUrl,
            pool: {
                min: 1,
                max: 10
            },
            debug: true
        });
        finished(tablesCreated);
    };

    function createTables(finished) {

        createPeople();

        function createPeople() {
            knex.schema.createTable('people', function (table) {
                table.increments('person_id').primary();
                table.string('username', ['40']);
                table.text('hashedPassword');
                table.text('salt');
                table.string('privacy');
            }).then(function () {
                console.log('table people created');
                createEmails();
            }).catch(function (err) {
                console.error(err);
            });
        };

        function createEmails() {
            knex.schema.createTable('emails', function (table) {
                table.increments('email_id').primary();
                table.integer('person_id').references('person_id').inTable('people');
                table.string('address', ['60']);
            }).then(function () {
                console.log('table emails created');
                createFriendships();
            }).catch(function (err) {
                console.error(err);
            });
        };

        function createFriendships() {
            knex.schema.createTable('friendships', function (table) {
                table.increments('friendship_id');
                table.integer('friendOne_id').references('person_id').inTable('people');
                table.integer('friendTwo_id').references('person_id').inTable('people');
            }).then(function () {
                console.log('table friendships created');
                createPosts();

            }).catch(function (err) {
                console.error(err);
            });
        };

        function createPosts() {
            knex.schema.createTable('posts', function (table) {
                table.increments('post_id');
                table.integer('owner_id').references('person_id').inTable('people');
                table.integer('page_id').references('person_id').inTable('people');
            }).then(function () {
                console.log('table posts created');
                createRequests();

            }).catch(function (err) {
                console.error(err);
            });
        };

        function createRequests() {
            knex.schema.createTable('requests', function (table) {
                table.increments('request_id');
                table.integer('sender_id').references('person_id').inTable('people');
                table.integer('receiver_id').references('person_id').inTable('people');
            }).then(function () {
                console.log('table requests created');
                finished();

            }).catch(function (err) {
                console.error(err);
            });

        };
    };

    function tablesCreated() {
        console.log('tables created');
    };

}

module.exports = setup;