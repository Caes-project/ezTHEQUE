'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Dvd = mongoose.model('Dvd'),
 fs = require('fs'),
    // http = require('http'),
    _ = require('lodash');


/**
 * Find dvd by id
 */
 exports.dvd = function(req, res, next, id) {
  Dvd.load(id, function(err, dvd) {
    if (err) return next(err);
    if (!dvd) return next(new Error('Failed to load dvd ' + id));
    req.dvd = dvd;
    next();
  });
};

/**
 * Create a dvd
 */
 exports.create = function(req, res) {
  var dvd = new Dvd(req.body);
  dvd.save(function(err) {
    if (err) {
      return res.send(400, '/dvds', {
        errors: err.errors,
        dvd: dvd
      });
    } else {
      res.jsonp(dvd);
    }
  });
};

function saveImageToServer(req, res, dvd){
  var target_path = __dirname + '/../../upload/' + dvd.ref + '_' +dvd.code_barre+'.'+req.files.image.extension;
        //ERR 34 file doesn"t find ...
        fs.rename(req.files.image.path, target_path, function (err) {
          /*fs.writeFile(target_path, data, function (err) {*/
            if(err){
              console.log(err);
              res.send(500, 'Répertoire d\'upload indisponible');
            }else{
                // res.jsonp(dvd);
                res.setHeader('Content-Type', 'text/html');
                res.status(200);
                if(req.body.create){
                  res.redirect('/#!/dvds/create');
                }else{   
                  res.redirect('/#!/dvds/'+ dvd._id);
                }
                // res.jsonp(dvd);
              }
              /*});*/
      });
      }

      exports.saveImage = function(req, res) {
        var dvd = new Dvd(req.body);
        dvd.emprunt = {
          user: null,
          date_debut : null,
          date_fin : null
        };
        if(req.files.image.originalname !== null){
          dvd.lien_image = '/packages/dvds/upload/' + req.body.ref + '_' +req.body.code_barre+'.'+ req.files.image.extension;
        }else{
          dvd.lien_image = '/packages/dvds/upload/default.jpg';
        }
        dvd.save(function(err) {
          if (err) {
            console.log(err);
            return res.send(400, {
              errors: err.errors,
              dvd: dvd
            });
          }  else {
            if(req.files.image.originalname !== null){
              saveImageToServer(req, res, dvd);
            }else{
                // res.jsonp(revue);
                res.setHeader('Content-Type', 'text/html');
                res.redirect('/#!/revues/create');
              }
            }
          });     
      };

      exports.edit = function(req, res) {
        var dvd;
        console.log('req.body');
        console.log(req.query);
        console.log(req.body);
        console.log(req.params);
        Dvd.load(req.params.dvdId, function(err, dvd_) {
          if(err){
            console.log(err);
          }else{
            dvd = dvd_;
            dvd = _.extend(dvd, req.body);
            if(req.files.image.originalname !== null){
             dvd.lien_image = '/packages/dvds/upload/' + dvd.ref + '_' +dvd.code_barre+'.'+ req.files.image.extension;
           }
           dvd.save(function(err) {
            if (err) {
              console.log(err);
              return res.send(400, {
                errors: err.errors,
                dvd: dvd
              });
            } else {
              console.log('dvd updated',dvd._id);
                    // set where the file should actually exists - in this case it is in the "images" directory
                    if(req.files.image.originalname !== null){
                      saveImageToServer(req, res, dvd);
                    }else{
                      res.setHeader('Content-Type', 'text/html');
                        // res.jsonp(dvd);
                        res.redirect('/#!/dvds/'+ dvd._id);
                      }
                    }
                  });
         }
       });     
};

/**
 * Update an dvd
 */
 exports.update = function(req, res) {
  if(req.body.emprunt.user && req.dvd.emprunt.user || !req.body.emprunt.user && !req.dvd.emprunt.user){
    console.log('Error : le dvd à déjà un emprunt');
    return res.send(400,'/', {
      errors: 'Error : le dvd à déjà un emprunt'
    });
  }else{
    var dvd = req.dvd;

    dvd = _.extend(dvd, req.body);

    dvd.save(function(err) {
      if (err) {
        console.log(err);
        return res.send(400,'users/signup', {
          errors: err.errors,
          dvd: dvd
        });
      } else {
        res.jsonp(dvd);
      }
    });
  }
};

/**
 * Delete an dvd
 */
 exports.destroy = function(req, res) {
  var dvd = req.dvd;

  dvd.remove(function(err) {
    if (err) {
      return res.send(400,'users/signup', {
        errors: err.errors,
        dvd: dvd
      });
    } else {
      res.jsonp(dvd);
    }
  });
};

/**
 * Show an dvd
 */
 exports.show = function(req, res) {
  res.jsonp(req.dvd);
};


exports.all = function(req, res) {
  Dvd.find(req.query).sort({'ref':1/-1}).populate('emprunt.user', 'name').exec(function(err, dvds) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(200, dvds);
    }
  });    
};

exports.getMaxRef = function(req, res){
  Dvd.find().sort({'ref':1/-1}).limit(-1).exec(function(err, dvd){
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      if(dvd[0])
        res.jsonp(200, dvd[0]);
      else{
        res.jsonp(200, {'ref' : 100000});
      }
    }
  });
};
