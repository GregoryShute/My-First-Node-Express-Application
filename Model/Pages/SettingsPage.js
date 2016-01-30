var EncryptionBehavor = require('../Behaviors/EncryptionBehavior');
var EB = EncryptionBehavor;
var Promise = require('bluebird');
var PageController = require('./PageController');


var SettingsPageController = Object.create(PageController);

//Override 
SettingsPageController.menu = {
    
    changePassword: {method: EB.changePassword}
    
};

//Override
SettingsPageController.onRender = function (render_args) {
    
    this.res.render('SettingsPage');
    
};


module.exports = SettingsPageController;