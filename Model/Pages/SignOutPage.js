var PageController = require('./PageController');


var SignOutPageController = Object.create(PageController);

//Override 
SignOutPageController.menu = {

};

//Override
SignOutPageController.onRender = function (render_args) {
    
    this.res.render('SignOutPage');
    
};


module.exports = SignOutPageController;