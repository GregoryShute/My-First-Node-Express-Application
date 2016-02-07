var Promise = require('bluebird');

var dbInitializer = require('./Model/Database/dbInitializer');

Promise.coroutine(function* () {

    var db_initialized_successfully = yield dbInitializer();

    return db_initialized_successfully;

})()
    .then(function (db_initialized_successfully) {

        if (!db_initialized_successfully) {

            throw 'Database Initialization Failed';

        } else {
            
            startApp();
            
        }

    })
    .catch(function (e) {

        console.error(e);
        
        process.exit();

    })

function startApp(){

var express = require('express');
var app = express();

var register = require('./middlewares/register');
app = register(app);

var localPassportMaker = require('./middlewares/localPassportMaker');
var passport = localPassportMaker();

var routes = require('./routes/routes');
routes(app, passport);

var port = process.env.PORT || 3000;
app.listen(port);

}



