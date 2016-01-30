var knex = require('../database/knex');
var Promise = require('bluebird');
var TransactionGear = require('../MotorGears/TransactionGear');
var TG = TransactionGear;

var FriendshipBehaviorMotor = {


    sendRequest(person_id, friend_id) {

        return knex('requests')
            .insert({ 'sender_id': person_id, 'receiver_id': friend_id })
            .then(function () {

                return true;

            })
            .catch(function (e) {

                console.err(e);

                return false;

            });

    },

    
    personHasRequest(person_id, friend_id) {

        return knex('requests')
            .where({ 'sender_id': friend_id, 'receiver_id': person_id })
            .then(function (data) {
                
                return (data.length !== 0);

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },
    

    acceptRequestT(person_id, friend_id) {

        return knex.transaction(function (trx) {

            var t = trx;

            return Promise.coroutine(function* () {

                var friend_transaction = yield Promise.props({

                    request_removal: FriendshipBehaviorMotor.removeRequests(person_id, friend_id, t),
                    friendship_created: FriendshipBehaviorMotor.addFriends(person_id, friend_id, t)

                });

                var success = yield TG.commitTransaction(t);

                return (success && friend_transaction.request_removal && friend_transaction.friendship_created);
            })()
                .then(function (transaction_success) {
                    
                    return transaction_success;
                    
                });

        })
            .then(function (transaction_success) {

                return transaction_success;

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },

    addFriends(person_id, friend_id, t) {

        return knex('friendships')
            .transacting(t)
            .insert({ friendOne_id: person_id, friendTwo_id: friend_id })
            .return(true)
            .catch(function (e) {

                console.error(e);
                
                return false;

            });

    },

    removeRequests(person_id, friend_id, t) {

        return knex('requests')
            .transacting(t)
            .where({ 'sender_id': friend_id, 'receiver_id': person_id })
            .del()
            .then(function () {

                return true;

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },
    
    
    getFriendsListOne(person_id) {

        return knex('friendships')
            .where('friendOne_id', person_id)
            .from('people').innerJoin('friendships', 'people.person_id', 'friendships.friendTwo_id')
            .map(function (friend) {

                return friend.username;

            })
            .catch(function (e) {

                console.error(e);

                return [];

            });

    },


    getFriendsListTwo(person_id) {

        return knex('friendships')
            .where('friendTwo_id', person_id)
            .from('people').innerJoin('friendships', 'people.person_id', 'friendships.friendOne_id')
            .map(function (friend) {

                return friend.username;

            })
            .catch(function (e) {

                console.error(e);

                return [];

            });

    }

};

module.exports = FriendshipBehaviorMotor;