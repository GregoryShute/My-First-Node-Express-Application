var knex = require('../Database/knex');
var Promise = require('bluebird');
var FriendshipBehaviorMotor = require('../BehaviorMotors/FriendshipBehaviorMotor');
var LookupBehavior = require('./LookupBehavior');
var FBM = FriendshipBehaviorMotor;
var LB = LookupBehavior;

var FriendshipBehavior = {


    sendFriendRequest(person_id, friend_name) {

        return Promise.coroutine(function* () {

            var friend = yield LB.getPersonByUsername(friend_name);
            var friend_id = friend[0].person_id;

            var request_or_friend = yield Promise.props({

                is_friend: FriendshipBehavior.areFriends(person_id, friend_id),
                is_request: FriendshipBehavior.areRequests(person_id, friend_id)

            });

            if (request_or_friend.is_friend || request_or_friend.is_request || (person_id === friend_id)) {

                return false;


            } else {

                var was_sent = yield FBM.sendRequest(person_id, friend_id);

                return was_sent;

            }

        })()
            .then(function (was_sent) {

                return was_sent;

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },

    acceptFriendRequest(person_id, friend_username) {

        return Promise.coroutine(function* () {

            var friend = yield LB.getPersonByUsername(friend_username);
            var friend_id = friend[0].person_id;
            var ok_to_accept = yield FBM.personHasRequest(person_id, friend_id);

            if (ok_to_accept) {

                var accepted = yield FBM.acceptRequestT(person_id, friend_id);

                return accepted;

            } else {

                return false;

            }

        })()
            .then(function (accepted) {

                return accepted;

            })
            .catch(function (e) {

                console.error(e);

                return false;

            });

    },

    areFriends(person_id, friend_id) {

        return knex('friendships')
            .where({ 'friend_one_id': person_id, 'friend_two_id': friend_id })
            .orWhere('friend_one_id', friend_id)
            .andWhere('friend_two_id', person_id)
            .then(function (data) {

                if (data.length !== 0) {

                    return true;

                } else {

                    return false;

                }

            })
            .catch(function (e) {

                console.error(e);

                throw e;

            });

    },

    areRequests(person_id, friend_id) {

        return knex('requests')
            .where({ 'sender_id': person_id, 'receiver_id': friend_id })
            .orWhere('sender_id', friend_id)
            .andWhere('receiver_id', person_id)
            .then(function (data) {

                if (data.length !== 0) {

                    return true;

                } else {

                    return false;

                }

            })
            .catch(function (e) {

                console.error(e);

                throw e;

            });

    },


    getFriends(person_id) {

        return Promise.coroutine(function* () {

            var friends = yield Promise.props({

                list_one: FBM.getFriendsListOne(person_id),
                list_two: FBM.getFriendsListTwo(person_id)

            });

            return { friends: friends.list_one.concat(friends.list_two) };

        })()
            .then(function (friends) {

                return friends;

            })
            .catch(function (e) {

                console.error(e);

                return { friends: [] };

            });

    },


    getReceivedRequests(person_id) {

        return knex('requests')
            .where('receiver_id', person_id)
            .from('people').innerJoin('requests', 'people.person_id', 'requests.sender_id')
            .map(function (sender) {

                return sender.username;

            })
            .then(function (received_requests) {

                return { received_requests: received_requests };

            })
            .catch(function (e) {

                console.error(e);

                return { received_requests: [] };

            });

    },


    getSentRequests(person_id) {

        return knex('requests')
            .where('sender_id', person_id)
            .from('people').innerJoin('requests', 'people.person_id', 'requests.receiver_id')
            .map(function (receiver) {

                return receiver.username;

            })
            .then(function (sent_requests) {

                return { sent_requests: sent_requests };

            })
            .catch(function (e) {

                console.error(e);

                return { sent_requests: [] };

            });

    }

};




module.exports = FriendshipBehavior;
