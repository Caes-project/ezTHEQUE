'use strict';

var revues = require('../controllers/revues');

var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.revue.user.id !== req.user.id) {
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
module.exports = function(Revues, app, auth, database) {

    app.route('/revues/getMaxRef')
        .get(auth.requiresAdmin, revues.getMaxRef);
    app.route('/revues/createRevues')
        .get(auth.requiresLogin, revues.createRevues); 
    app.route('/revues/getRevues')
        .get(auth.requiresLogin, revues.getRevues);
    app.route('/revues/:revueId/emprunt')
        .post(auth.requiresLogin, revues.update);
    app.route('/revues/upload')
        .post(auth.requiresLogin, isAdmin,revues.saveImage);
    app.route('/revues/:revueId/edit')
        .post(auth.requiresLogin, isAdmin,revues.edit);
    app.route('/revues')
        .get(revues.all)
        .post(auth.requiresLogin, isAdmin, revues.saveImage);
    app.route('/revues/:revueId')
        .get(revues.show)
        .put(auth.requiresLogin, hasAuthorization, revues.update)
        .delete(auth.requiresLogin, hasAuthorization, revues.destroy);
    app.route('/revues/list')
        .get(revues.all);

    // Finish with setting up the revueId param
    app.param('revueId', revues.revue);

};
