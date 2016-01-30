var SearchBehavior = require('../Behaviors/SearchBehavior');
var SB = SearchBehavior;
var FriendshipBehavior = require('../Behaviors/FriendshipBehavior');
var FB = FriendshipBehavior;
var PageController = require('./PageController');


var SearchPageController = Object.create(PageController);

//Override 
SearchPageController.menu = {
    
    getUsernamesByRegex: {method: SB.getUsernamesByRegex},
    sendFriendRequest: {method: FB.sendFriendRequest}
    
};

//Override
SearchPageController.onRender = function (render_args) {
    
    this.res.render('SearchPage');
    
};


module.exports = SearchPageController;