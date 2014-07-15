'use strict';

// The Package is past automatically as first parameter
module.exports = function(Bd, app, auth, database) {

    app.get('/bd/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/bd/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/bd/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/bd/example/render', function(req, res, next) {
        Bd.render('index', {
            package: 'bd'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
