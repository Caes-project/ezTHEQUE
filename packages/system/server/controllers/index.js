'use strict';

var mean = require('meanio'),
    child_process = require('child_process');

exports.render = function(req, res) {

  var modules = [];
  // Preparing angular modules list with dependencies
  for (var name in mean.modules) {
    modules.push({
      name: name,
      module: 'mean.' + name,
      angularDependencies: mean.modules[name].angularDependencies
    });
  }

  function isAdmin() {
    return req.user && req.user.roles.indexOf('admin') !== -1;
  }

  // Send some basic starting info to the view
  res.render('index', {
    user: req.user ? {
      name: req.user.name,
      _id: req.user._id,
      username: req.user.username,
      roles: req.user.roles
    } : {},
    modules: modules,
    isAdmin: isAdmin,
    adminEnabled: isAdmin() && mean.moduleEnabled('mean-admin')
  });
};

exports.exportMongo = function(req, res){
  child_process.execFile(__dirname + '/exportMongo.sh', function(err, stdout, stderr){
    console.log(err);
    console.log(stderr);
    res.redirect('/');
  });
};

exports.getCSV = function(req, res){
  console.log('ici');
   // var file = __dirname + '/upload-folder/' + req.filename;
   var file = './export/' + req.csvname;
  res.download(file, function(err){
    if(err){
      console.log(err);
    }
  }); // Set disposition and send it.
};

exports.typeCSV = function(req, res, next, typeCSV){
  req.csvname = typeCSV;
  next();
};