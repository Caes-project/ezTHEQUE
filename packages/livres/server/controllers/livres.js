'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Livre = mongoose.model('Livre'),
    fs = require('fs'),
    // http = require('http'),
    request = require('request'),
    _ = require('lodash');


/**
 * Find livre by id
 */
exports.livre = function(req, res, next, id) {
    Livre.load(id, function(err, livre) {
        if (err) return next(err);
        if (!livre) return next(new Error('Failed to load livre ' + id));
        req.livre = livre;
        next();
    });
};

/**
 * Create a livre
 */
exports.create = function(req, res) {
    var livre = new Livre(req.body);
    livre.save(function(err) {
        if (err) {
            return res.send(400, '/livres', {
                errors: err.errors,
                livre: livre
            });
        } else {
            res.jsonp(livre);
        }
    });
};

function saveImageToServer(req, res, livre){
    var target_path = __dirname + '/../../upload/' + livre.ref + '_' +livre.code_barre+ req.files.image.extension;
        //ERR 34 file doesn"t find ...
        fs.rename(req.files.image.path, target_path, function (err) {
          /*fs.writeFile(target_path, data, function (err) {*/
            if(err){
                console.log(err);
                res.send(500, 'Répertoire d\'upload indisponible');
            }else{
                // res.jsonp(livre);
                res.setHeader('Content-Type', 'text/html');
                res.status(200);
                if(req.body.create){
                    res.redirect('/#!/livres/create');
                }else{   
                    res.redirect('/#!/livres/'+ livre._id);
                }
                // res.jsonp(livre);
            }
          /*});*/
        });
}

exports.saveImage = function(req, res) {
    var livre = new Livre(req.body);
    livre.emprunt = {
                        user: null,
                        date_debut : null,
                        date_fin : null
                    };
    if(req.body.lien_image){
        livre.lien_image = '/packages/livres/upload/' + req.body.ref + '_' +req.body.code_barre+ '.jpg';
    }else if(req.files.image){
        livre.lien_image = '/packages/livres/upload/' + req.body.ref + '_' +req.body.code_barre+ req.files.image.extension;
    }else{
        livre.lien_image = '/packages/default.jpg';
    }
   livre.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(400, {
                errors: err.errors,
                livre: livre
            });
        } else {
            if(req.body.lien_image){
                var targetpath = __dirname + '/../../upload/' + req.body.ref + '_' +req.body.code_barre+'.jpg';
                var file = fs.createWriteStream(targetpath);
                var options = {
                    method: 'GET',
                    uri: req.body.lien_image,
                    headers : {
                        'User-Agent': 'Mozilla/5.0'
                    },
                    jar: true,
                    proxy : process.env.http_proxy || null
                };
                request(options)
                .pipe(file)
                .on('error', function (err) {
                    console.log(err);
                    fs.unlink(targetpath); // Delete the file async. (But we don't check the result)
                    res.send(500, 'Répertoire d\'upload indisponible');
                }).on('finish', function () {
                    res.status(200);
                    // res.cookie('info_mess', encodeURI('Livre créé avec succès !'));
                    res.jsonp(livre);
                    // res.redirect('/#!/livres/');
                });
            }else{
                // res.jsonp(livre);
                res.setHeader('Content-Type', 'text/html');
                res.jsonp(livre);
                // res.redirect('/#!/livres/'+ livre._id);
            }
        }
    });     
};

exports.edit = function(req, res) {
    var livre;
    console.log('req.body');
    console.log(req.query);
    console.log(req.body);
    console.log(req.params);
    Livre.load(req.params.livreId, function(err, livre_) {
        if(err){
            console.log(err);
        }else{
            livre = livre_;
            livre = _.extend(livre, req.body);
            if(req.files.image.originalname !== null){
               livre.lien_image = '/packages/livres/upload/' + livre.ref + '_' +livre.code_barre+ req.files.image.extension;
            }
            livre.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(400, {
                        errors: err.errors,
                        livre: livre
                    });
                } else {
                    console.log('livre updated',livre._id);
                    // set where the file should actually exists - in this case it is in the "images" directory
                    if(req.files.image.originalname !== null){
                        saveImageToServer(req, res, livre);
                    }else{
                        res.setHeader('Content-Type', 'text/html');
                        // res.jsonp(livre);
                        res.redirect('/#!/livres/'+ livre._id);
                    }
                }
            });
        }
    });     
};

/**
 * Update an livre
 */
exports.update = function(req, res) {
    if(req.body.emprunt.user && req.livre.emprunt.user || !req.body.emprunt.user && !req.livre.emprunt.user){
        console.log('Error : le livre à déjà un emprunt');
        return res.send(400,'/', {
            errors: 'Error : le livre à déjà un emprunt'
        });
    }else{
        var livre = req.livre;

        livre = _.extend(livre, req.body);

        livre.save(function(err) {
            if (err) {
                return res.send(400,'users/signup', {
                    errors: err.errors,
                    livre: livre
                });
            } else {
                res.jsonp(livre);
            }
        });
    }
};

/**
 * Delete an livre
 */
exports.destroy = function(req, res) {
    var livre = req.livre;

    livre.remove(function(err) {
        if (err) {
            return res.send(400,'users/signup', {
                errors: err.errors,
                livre: livre
            });
        } else {
            res.jsonp(livre);
        }
    });
};

/**
 * Show an livre
 */
exports.show = function(req, res) {
    res.jsonp(req.livre);
};

/**
 * List of Livres
 */
exports.all = function(req, res) {
    if(req.query){
        Livre.find(req.query).sort({'ref':1/-1}).limit(250).exec(function(err, livres) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, livres);
            }
        });
    }else{
        Livre.find().sort('-created').exec(function(err, livres) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, livres);
            }
        });
    }
};

exports.getMaxRef = function(req, res){
    Livre.find().sort({'ref':1/-1}).limit(-1).exec(function(err, livre){
         if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                if(livre[0])
                    res.jsonp(200, livre[0]);
                else{
                    res.jsonp(200, {'ref' : 200000});
                }
            }
    });
};
