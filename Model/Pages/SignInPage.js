var EncryptionBehavior = require('../Behaviors/EncryptionBehavior');
var E = EncryptionBehavior;
var PageController = require('./PageController');


var SignInPageController = Object.create(PageController);

//Override 
SignInPageController.menu = {

};

//Override
SignInPageController.onRender = function (render_args) {
    
    this.res.render('SignInPage');
    
};


module.exports = SignInPageController;