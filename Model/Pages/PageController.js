var Promise = require('bluebird');

var PageController = {

};

PageController.menu = {

};

PageController.onRender = function (render_args) {

};

PageController.loadSession = function (session, res) {

    PageController.person_id = session.person_id;
    PageController.username = session.username;
    PageController.res = res;

};

PageController.onRequest = function (order) {

    try {

        var command = this.menu[order.run_method].method;
        var command_args = order.command_args;

        var args_length = command_args.length;

        for (var index = 0; index < args_length; index += 1) {

            if (command_args[index] === 'person_id') {

                command_args[index] = this.person_id;
            }

            if (command_args[index] === 'username') {

                command_args[index] = this.username;
            }

        };


        Promise.coroutine(function* () {

            var response_obj = yield command.apply(this, command_args); //behavior

            return response_obj;

        })().then(function (response_obj) {

            PageController.res.json({ "served": response_obj });

            return true;
        })
            .catch(function (e) {

                console.error(e);

                return false;

            });




    } catch (e) {

        console.error(e);

        PageController.onRender();

    }


};


module.exports = PageController;