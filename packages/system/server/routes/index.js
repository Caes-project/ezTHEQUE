'use strict';

module.exports = function(System, app, auth, database) {

  // Home route
  var index = require('../controllers/index');
  app.route('/')
    .get(index.render);
  app.route('/admin/export')
  	.get(auth.requiresAdmin, index.exportMongo);
  app.route('/admin/recupExport/:type')
  	.get(auth.requiresAdmin, index.getCSV);

  app.param('type', index.typeCSV);
};
