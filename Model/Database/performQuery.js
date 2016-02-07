function performQuery(client, query_string, resolve_error_codes) {

    var QueryFinishedPromise = new Promise(

        function resolver(resolve, reject) {

            var query = client.query(query_string);

            query.on('end', function () {

                resolve('resolved');

            });


            query.on('error', function (e) {

                var should_resolve = false;

                resolve_error_codes.forEach(function (element) {
                   
                    if (e.code === element) {
                        should_resolve = true;
                    }

                }, this);

                if (should_resolve) {

                    resolve('resolved');

                } else {

                    reject(e);

                }

            });

        }

        );

    return QueryFinishedPromise;

};



module.exports = performQuery;