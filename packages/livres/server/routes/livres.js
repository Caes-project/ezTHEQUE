'use strict';

var livres = require('../controllers/livres');

// The Package is past automatically as first parameter
module.exports = function(Livres, app, auth, database) {

    app.route('/livres/getMaxRef')
        .get(livres.getMaxRef);
    app.route('/livres/Settings')
        .get(livres.getSettings(Livres))
        .put(auth.requiresAdmin, livres.putSettings(Livres));
    app.route('/livres/:livreId/emprunt')
        .post(auth.requiresLogin, livres.update);
    app.route('/livres/upload')
        .post(auth.requiresAdmin,livres.saveImage);
    app.route('/livres/:livreId/edit')
        .post(auth.requiresAdmin,livres.edit);
    app.route('/livres')
        .get(livres.all)
        .post(auth.requiresAdmin, livres.saveImage);
    app.route('/livres/:livreId')
        .get(livres.show)
        .put(auth.requiresAdmin, livres.update)
        .delete(auth.requiresAdmin, livres.destroy);
    app.route('/livres/list')
        .get(livres.all);

    // Finish with setting up the livreId param
    app.param('livreId', livres.livre);

};
