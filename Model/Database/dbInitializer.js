var Promise = require('bluebird');
var performQuery = require('./performQuery');
var postgresUri = require('./connectionString');

function dbInitializer() {

    var pg = require('pg');
    var client = new pg.Client(postgresUri);
    
    client.connect();

    return Promise.coroutine(function* () {

        var create_table_people_string = "CREATE TABLE IF NOT EXISTS people(" +
            "person_id serial primary key," +
            "username varchar(40)," +
            "hashed_password text," +
            "salt text," +
            "privacy varchar(50)" +
            ");";

        var create_table_emails_string = "CREATE TABLE IF NOT EXISTS emails(" +
            "email_id serial primary key," +
            "person_id bigint, " +
            "username varchar(40)," +
            "address varchar(60)" +
            ");";

        var create_table_friendships_string = "CREATE TABLE IF NOT EXISTS friendships(" +
            "friendship_id serial primary key," +
            "friend_one_id bigint," +
            "friend_two_id bigint" +
            ");";

        var create_table_posts_string = "CREATE TABLE IF NOT EXISTS posts(" +
            "post_id serial primary key," +
            "owner_id bigint," +
            "page_id bigint" +
            ");";

        var create_table_requests_string = "CREATE TABLE IF NOT EXISTS requests(" +
            "request_id serial primary key," +
            "sender_id bigint," +
            "receiver_id bigint" +
            ");";

        var emails_constraint_string = "ALTER TABLE emails " +
            "ADD CONSTRAINT person_id " +
            "FOREIGN KEY (person_id) " +
            "REFERENCES people(person_id);"

        var friendships_constraint_one_string = "ALTER TABLE friendships " +
            "ADD CONSTRAINT friend_one_id " +
            "FOREIGN KEY (friend_one_id) " +
            "REFERENCES people(person_id);"

        var friendships_constraint_two_string = "ALTER TABLE friendships " +
            "ADD CONSTRAINT friend_two_id " +
            "FOREIGN KEY (friend_one_id) " +
            "REFERENCES people(person_id);"

        var posts_constraint_one_string = "ALTER TABLE posts " +
            "ADD CONSTRAINT owner_id " +
            "FOREIGN KEY (owner_id) " +
            "REFERENCES people(person_id);"

        var posts_constraint_two_string = "ALTER TABLE posts " +
            "ADD CONSTRAINT page_id " +
            "FOREIGN KEY (page_id) " +
            "REFERENCES people(person_id);"

        var requests_constraint_one_string = "ALTER TABLE requests " +
            "ADD CONSTRAINT sender_id " +
            "FOREIGN KEY (sender_id) " +
            "REFERENCES people(person_id);"

        var requests_constraint_two_string = "ALTER TABLE requests " +
            "ADD CONSTRAINT receiver_id " +
            "FOREIGN KEY (receiver_id) " +
            "REFERENCES people(person_id);"


        var resolve_error_codes = ['42710'];
        
        var table_creation_success_vector = yield Promise.props({

            people: performQuery(client, create_table_people_string),
            emails: performQuery(client, create_table_emails_string),
            friendships: performQuery(client, create_table_friendships_string),
            posts: performQuery(client, create_table_posts_string),
            requests: performQuery(client, create_table_requests_string)

        });

        var constraints_to_people_success_vector = yield Promise.props({

            emails_constraint: yield performQuery(client, emails_constraint_string, resolve_error_codes),
            friendships_constraint_one: yield performQuery(client, friendships_constraint_one_string, resolve_error_codes),
            friendships_constraint_two: yield performQuery(client, friendships_constraint_two_string, resolve_error_codes),
            posts_constraint_one: yield performQuery(client, posts_constraint_one_string, resolve_error_codes),
            posts_constraint_two: yield performQuery(client, posts_constraint_two_string, resolve_error_codes),
            requests_constraint_one: yield performQuery(client, requests_constraint_one_string, resolve_error_codes),
            requests_constraint_two: yield performQuery(client, requests_constraint_two_string, resolve_error_codes)

        });

        var vector_one = [table_creation_success_vector.people,
            table_creation_success_vector.emails,
            table_creation_success_vector.friendships,
            table_creation_success_vector.posts,
            table_creation_success_vector.requests];

        var vector_two = [constraints_to_people_success_vector.emails_constraint,
            constraints_to_people_success_vector.friendships_constraint_one,
            constraints_to_people_success_vector.friendships_constraint_two,
            constraints_to_people_success_vector.posts_constraint_one,
            constraints_to_people_success_vector.posts_constraint_two,
            constraints_to_people_success_vector.requests_constraint_one,
            constraints_to_people_success_vector.requests_constraint_two];

        var success_vectors = { one: vector_one, two: vector_two };
        
        client.end();
        
        return success_vectors;

    })()
        .then(function (success_vectors) {
            
            return success_vectors;

        })
        .catch(function (e) {

            console.error(e);

            throw e;

        })


};

module.exports = dbInitializer;