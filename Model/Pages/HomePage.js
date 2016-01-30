var FriendshipBehavor = require('../Behaviors/FriendshipBehavior');
var FB = FriendshipBehavor;
var Promise = require('bluebird');
var PageController = require('./PageController');



var HomePageController = Object.create(PageController);

//Override 
HomePageController.menu = {
    
    getFriends: {method: FB.getFriends},
    getReceivedRequests: {method: FB.getReceivedRequests},
    getSentRequests: {method: FB.getSentRequests},
    acceptFriendRequest: {method: FB.acceptFriendRequest}
    
};

//Override
HomePageController.onRender = function (render_args) {

    this.res.render('HomePage', {
        
            username: HomePageController.username,
            
        });
};


module.exports = HomePageController;