'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Cd = mongoose.model('Cd'),
 fs = require('fs'),
    // http = require('http'),
    _ = require('lodash');


/**
 * Find cd by id
 */
 exports.cd = function(req, res, next, id) {
  Cd.load(id, function(err, cd) {
    if (err) return next(err);
    if (!cd) return next(new Error('Failed to load cd ' + id));
    req.cd = cd;
    next();
  });
};

/**
 * Create a cd
 */
 exports.create = function(req, res) {
  var cd = new Cd(req.body);
  cd.save(function(err) {
    if (err) {
      return res.send(400, '/cds', {
        errors: err.errors,
        cd: cd
      });
    } else {
      res.jsonp(cd);
    }
  });
};

function saveImageToServer(req, res, cd){
  var target_path = __dirname + '/../../upload/' + cd.ref + '_' +cd.code_barre +'.'+req.files.image.extension;
        //ERR 34 file doesn"t find ...
        fs.rename(req.files.image.path, target_path, function (err) {
          /*fs.writeFile(target_path, data, function (err) {*/
            if(err){
              console.log(err);
              res.send(500, 'Répertoire d\'upload indisponible');
            }else{
                // res.jsonp(cd);
                res.setHeader('Content-Type', 'text/html');
                res.status(200);
                if(req.body.create){
                  res.redirect('/#!/cds/create');
                }else{   
                  res.redirect('/#!/cds/'+ cd._id);
                }
                // res.jsonp(cd);
              }
              /*});*/
      });
      }

      exports.saveImage = function(req, res) {
        var cd = new Cd(req.body);
        cd.emprunt = {
          user: null,
          date_debut : null,
          date_fin : null
        };
        if(req.files.image.originalname !== null){
          cd.lien_image = '/packages/cds/upload/' + req.body.ref + '_' +req.body.code_barre+'.'+ req.files.image.extension;
        }else{
          cd.lien_image = '/packages/cds/upload/default.jpg';
        }
        cd.save(function(err) {
          if (err) {
            console.log(err);
            return res.send(400, {
              errors: err.errors,
              cd: cd
            });
          }  else {
            if(req.files.image.originalname !== null){
              saveImageToServer(req, res, cd);
            }else{
                // res.jsonp(revue);
                res.setHeader('Content-Type', 'text/html');
                res.redirect('/#!/revues/create');
              }
            }
          });     
      };

      exports.edit = function(req, res) {
        var cd;
        Cd.load(req.params.cdId, function(err, cd_) {
          if(err){
            console.log(err);
          }else{
            cd = cd_;
            cd = _.extend(cd, req.body);
            if(req.files.image.originalname !== null){
             cd.lien_image = '/packages/cds/upload/' + cd.ref + '_' +cd.code_barre+'.'+ req.files.image.extension;
           }
           cd.save(function(err) {
            if (err) {
              console.log(err);
              return res.send(400, {
                errors: err.errors,
                cd: cd
              });
            } else {
              console.log('cd updated',cd._id);
                    // set where the file should actually exists - in this case it is in the "images" directory
                    if(req.files.image.originalname !== null){
                      saveImageToServer(req, res, cd);
                    }else{
                      res.setHeader('Content-Type', 'text/html');
                        // res.jsonp(cd);
                        res.redirect('/#!/cds/'+ cd._id);
                      }
                    }
                  });
         }
       });     
};

/**
 * Update an cd
 */
 exports.update = function(req, res) {
  if(req.body.emprunt.user && req.cd.emprunt.user || !req.body.emprunt.user && !req.cd.emprunt.user){
    console.log('Error : le cd à déjà un emprunt');
    return res.send(400,'/', {
      errors: 'Error : le cd à déjà un emprunt'
    });
  }else{
    var cd = req.cd;

    cd = _.extend(cd, req.body);

    cd.save(function(err) {
      if (err) {
        return res.send(400,'users/signup', {
          errors: err.errors,
          cd: cd
        });
      } else {
        res.jsonp(cd);
      }
    });
  }
};

/**
 * Delete an cd
 */
 exports.destroy = function(req, res) {
  var cd = req.cd;

  cd.remove(function(err) {
    if (err) {
      return res.send(400,'users/signup', {
        errors: err.errors,
        cd: cd
      });
    } else {
      res.jsonp(cd);
    }
  });
};

/**
 * Show an cd
 */
 exports.show = function(req, res) {
  res.jsonp(req.cd);
};

/**
 * List of Cds
 */
 exports.all = function(req, res) {
  Cd.find(req.query).sort({'ref':1/-1}).populate('emprunt.user', 'name').exec(function(err, cds) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(200, cds);
    }
  });
};

exports.getMaxRef = function(req, res){
  Cd.find().sort({'ref':1/-1}).limit(-1).exec(function(err, cd){
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      if(cd[0])
        res.jsonp(200, cd[0]);
      else{
        res.jsonp(200, {'ref' : 100000});
      }
    }
  });
};
