var pool = require('./pool');

module.exports = function(/* args, callback */) {
    var args = [].slice.call(arguments);
    var callback = args.pop();

    /* args */
    pool.getConnection(function(err, connection) {
        if (err) throw err;

        args.push(function(/* err, ... results */) {
            connection.end();
            callback.apply(null, arguments);
        });
        connection.query.apply(connection, args)
    })
};