'use strict';

var livres = require('../controllers/livres');
/*
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.livre.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};
*/
// The Package is past automatically as first parameter
module.exports = function(Livres, app, auth, database) {

    app.get('/livres/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/livres/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/livres/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/livres/example/render', function(req, res, next) {
        Livres.render('index', {
            package: 'livres'
        }, function(err, html) {
            console.log(html);
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });

    app.route('/livres')
        // .get(livres.all)
        .post(auth.requiresLogin, livres.create);
    app.route('/livres/:livreId');
        // .get(livres.show)
        // .put(auth.requiresLogin, hasAuthorization, livres.update)
        // .delete(auth.requiresLogin, hasAuthorization, livres.destroy);

    // Finish with setting up the livreId param
    // app.param('livreId', livres.livre);

};
