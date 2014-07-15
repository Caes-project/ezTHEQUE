'use strict';

var bds = require('../controllers/bds');

var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.bd.user.id !== req.user.id) {
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

    app.route('/bds/getMaxRef')
        .get(auth.requiresAdmin, bds.getMaxRef);
    app.route('/bds/:bdId/emprunt')
        .post(auth.requiresLogin, bds.update);
    app.route('/bds/upload')
        .post(auth.requiresLogin, isAdmin,bds.saveImage);
    app.route('/bds/:bdId/edit')
        .post(auth.requiresLogin, isAdmin,bds.edit);
    app.route('/bds')
        .get(bds.all)
        .post(auth.requiresLogin, isAdmin, bds.saveImage);
    app.route('/bds/:bdId')
        .get(bds.show)
        .put(auth.requiresLogin, hasAuthorization, bds.update)
        .delete(auth.requiresLogin, hasAuthorization, bds.destroy);
    app.route('/bds/list')
        .get(bds.all);

    // Finish with setting up the bdId param
    app.param('bdId', bds.bd);

};
