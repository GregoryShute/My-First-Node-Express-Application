var CreationBehavior = require('../Behaviors/CreationBehavior');
var CB = CreationBehavior;
var PageController = require('./PageController');


var SignUpPageController = Object.create(PageController);

//Override 
SignUpPageController.menu = {
    
    createUser: {method: CB.createUser}
    
};

//Override
SignUpPageController.onRender = function (render_args) {
 
    this.res.render('SignUpPage');
    
};


module.exports = SignUpPageController;
