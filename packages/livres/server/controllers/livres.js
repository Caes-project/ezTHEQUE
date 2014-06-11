'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Livre = mongoose.model('Livre'),
    fs = require('fs'),
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

exports.saveImage = function(req, res) {
    var livre = new Livre(req.body);
    livre.emprunt = {
                        user: null,
                        date_debut : null,
                        date_fin : null
                    };
    // console.log(req.body.date_acquis);
    // console.log(req.files);
    if(req.files.image.originalname !== null){
         livre.lien_image = '/public/upload/livres/' +req.files.image.originalname;
    }
        livre.save(function(err) {
            if (err) {
                return res.send(400, {
                    errors: err.errors,
                    livre: livre
                });
            } else {
                console.log('livre saved',livre._id);
                // set where the file should actually exists - in this case it is in the "images" directory
                if(req.files.image.originalname !== null){
                    var target_path = __dirname +'/../../../../public/upload/livres/' +req.files.image.originalname;
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
                            res.redirect('/#!/livres/'+ livre._id);
                        }
                      /*});*/
                    });
                }else{
                    // res.jsonp(livre);
                    res.setHeader('Content-Type', 'text/html');
                    res.redirect('/#!/livres/'+ livre._id);
                }
            }
        });     
};

/**
 * Update an livre
 */
exports.update = function(req, res) {
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
    console.log(req.query);
    Livre.find({ref : req.query.ref}).sort('-created').exec(function(err, livres) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(200, livres);
        }
    });
};
