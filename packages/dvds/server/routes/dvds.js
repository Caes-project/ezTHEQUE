'use strict';

var dvds = require('../controllers/dvds');

var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.dvd.user.id !== req.user.id) {
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
module.exports = function(Dvds, app, auth, database) {

    app.route('/dvds/getMaxRef')
        .get(auth.requiresAdmin, dvds.getMaxRef);
    app.route('/dvds/:dvdId/emprunt')
        .post(auth.requiresLogin, dvds.update);
    app.route('/dvds/upload')
        .post(auth.requiresLogin, isAdmin,dvds.saveImage);
    app.route('/dvds/:dvdId/edit')
        .post(auth.requiresLogin, isAdmin,dvds.edit);
    app.route('/dvds')
        .get(dvds.all)
        .post(auth.requiresLogin, isAdmin, dvds.saveImage);
    app.route('/dvds/:dvdId')
        .get(dvds.show)
        .put(auth.requiresLogin, hasAuthorization, dvds.update)
        .delete(auth.requiresLogin, hasAuthorization, dvds.destroy);
    app.route('/dvds/list')
        .get(dvds.all);

    // Finish with setting up the dvdId param
    app.param('dvdId', dvds.dvd);

};
