'use strict';

var livres = require('../controllers/livres');

var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.livre.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

var isAdmin = function(req, res, next) {
    if (!req.user.isAdmin) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Livres, app, auth, database) {

    app.route('/livres/getMaxRef')
        .get(auth.requiresAdmin, livres.getMaxRef);
    app.route('/livres/:livreId/emprunt')
        .post(auth.requiresLogin, livres.update);
    app.route('/livres/upload')
        .post(auth.requiresLogin, isAdmin,livres.saveImage);
    app.route('/livres/:livreId/edit')
        .post(auth.requiresLogin, isAdmin,livres.edit);
    app.route('/livres')
        .get(livres.all)
        .post(auth.requiresLogin, isAdmin, livres.create);
    app.route('/livres/:livreId')
        .get(livres.show)
        .put(auth.requiresLogin, hasAuthorization, livres.update)
        .delete(auth.requiresLogin, hasAuthorization, livres.destroy);
    app.route('/livres/list')
        .get(livres.all);

    // Finish with setting up the livreId param
    app.param('livreId', livres.livre);

};
