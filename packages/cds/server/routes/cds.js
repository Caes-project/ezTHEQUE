'use strict';

var cds = require('../controllers/cds');

var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.cd.user.id !== req.user.id) {
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
module.exports = function(Cds, app, auth, database) {

    app.route('/cds/getMaxRef')
        .get(auth.requiresAdmin, cds.getMaxRef);
    app.route('/cds/:cdId/emprunt')
        .post(auth.requiresLogin, cds.update);
    app.route('/cds/upload')
        .post(auth.requiresLogin, isAdmin,cds.saveImage);
    app.route('/cds/:cdId/edit')
        .post(auth.requiresLogin, isAdmin,cds.edit);
    app.route('/cds')
        .get(cds.all)
        .post(auth.requiresLogin, isAdmin, cds.saveImage);
    app.route('/cds/:cdId')
        .get(cds.show)
        .put(auth.requiresLogin, hasAuthorization, cds.update)
        .delete(auth.requiresLogin, hasAuthorization, cds.destroy);
    app.route('/cds/list')
        .get(cds.all);

    // Finish with setting up the cdId param
    app.param('cdId', cds.cd);

};
