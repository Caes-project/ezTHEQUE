'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Revue = mongoose.model('Revue'),
    ListeRevues = mongoose.model('ListeRevues'),
    fs = require('fs'),
    // http = require('http'),
    _ = require('lodash');


/**
 * Find revue by id
 */
exports.revue = function(req, res, next, id) {
    Revue.load(id, function(err, revue) {
        if (err) return next(err);
        if (!revue) return next(new Error('Failed to load revue ' + id));
        req.revue = revue;
        next();
    });
};

/**
 * Create a revue
 */
exports.create = function(req, res) {
    var revue = new Revue(req.body);
    revue.save(function(err) {
        if (err) {
            return res.send(400, '/revues', {
                errors: err.errors,
                revue: revue
            });
        } else {
            res.jsonp(revue);
        }
    });
};

function saveImageToServer(req, res, revue){
    var target_path = __dirname + '/../../upload/' + revue.ref + '_' +revue.code_barre+ req.files.image.extension;
        //ERR 34 file doesn"t find ...
        fs.rename(req.files.image.path, target_path, function (err) {
          /*fs.writeFile(target_path, data, function (err) {*/
            if(err){
                console.log(err);
                res.send(500, 'Répertoire d\'upload indisponible');
            }else{
                // res.jsonp(revue);
                res.setHeader('Content-Type', 'text/html');
                res.status(200);
                if(req.body.create){
                    res.redirect('/#!/revues/create');
                }else{   
                    res.redirect('/#!/revues/'+ revue._id);
                }
                // res.jsonp(revue);
            }
          /*});*/
        });
}

exports.saveImage = function(req, res) {
    var revue = new Revue(req.body);
    console.log(revue);
    revue.emprunt = {
                        user: null,
                        date_debut : null,
                        date_fin : null
                    };
    if(req.files.image.originalname !== null){
        revue.lien_image = '/packages/revues/upload/' + req.body.ref + '_' +req.body.code_barre+ req.files.image.extension;
    }
        revue.save(function(err) {
            if (err) {
                console.log(err);
                return res.send(400, {
                    errors: err.errors,
                    revue: revue
                });
            } else {
                if(req.files.image.originalname !== null){
                    saveImageToServer(req, res, revue);
                }else{
                    // res.jsonp(revue);
                    res.setHeader('Content-Type', 'text/html');
                    res.redirect('/#!/revues/'+ revue._id);
                }
            }
        });     
};

exports.edit = function(req, res) {
    var revue;
    Revue.load(req.params.revueId, function(err, revue_) {
        if(err){
            console.log(err);
        }else{
            revue = revue_;
            revue = _.extend(revue, req.body);
            if(req.files.image.originalname !== null){
               revue.lien_image = '/packages/revues/upload/' + revue.ref + '_' +revue.code_barre+ req.files.image.extension;
            }
            revue.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(400, {
                        errors: err.errors,
                        revue: revue
                    });
                } else {

                    // set where the file should actually exists - in this case it is in the "images" directory
                    if(req.files.image.originalname !== null){
                        saveImageToServer(req, res, revue);
                    }else{
                        res.setHeader('Content-Type', 'text/html');
                        // res.jsonp(revue);
                        res.redirect('/#!/revues/'+ revue._id);
                    }
                }
            });
        }
    });     
};

/**
 * Update an revue
 */
exports.update = function(req, res) {
    if(req.body.emprunt.user && req.revue.emprunt.user || !req.body.emprunt.user && !req.revue.emprunt.user){
        console.log('Error : le revue à déjà un emprunt');
        return res.send(400,'/', {
            errors: 'Error : le revue à déjà un emprunt'
        });
    }else{
        var revue = req.revue;

        revue = _.extend(revue, req.body);

        revue.save(function(err) {
            if (err) {
                return res.send(400,'users/signup', {
                    errors: err.errors,
                    revue: revue
                });
            } else {
                res.jsonp(revue);
            }
        });
    }
};

/**
 * Delete an revue
 */
exports.destroy = function(req, res) {
    var revue = req.revue;

    revue.remove(function(err) {
        if (err) {
            return res.send(400,'users/signup', {
                errors: err.errors,
                revue: revue
            });
        } else {
            res.jsonp(revue);
        }
    });
};

/**
 * Show an revue
 */
exports.show = function(req, res) {
    res.jsonp(req.revue);
};

/**
 * List of Revues
 */
exports.all = function(req, res) {
    if(req.query){
        Revue.find(req.query).sort('-created').exec(function(err, revues) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, revues);
            }
        });
    }else{
        Revue.find().sort('-created').exec(function(err, revues) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, revues);
            }
        });
    }
};

exports.getRevues = function(req, res) {
    console.log('revues');
    console.log(Object.keys(req.query));
    if(Object.keys(req.query).length !== 0){
        ListeRevues.find(req.query).sort('-created').exec(function(err, revues) {
            console.log('revues lol');
            console.log(revues);
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, revues);
            }
        });
    }else{
        ListeRevues.find().sort('-created').exec(function(err, revues) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                console.log(revues);
                res.jsonp(200, revues);
            }
        });
    }
};

exports.createRevues = function(req, res){
     var revue = new ListeRevues(req.query);
        revue.save(function(err){
            console.log(revue);
            res.jsonp(200, revue);
        });
};

exports.getMaxRef = function(req, res){
    Revue.find().sort({'ref':1/-1}).limit(-1).exec(function(err, revue){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            if(revue[0])
                res.jsonp(200, revue[0]);
            else{
                res.jsonp(200, {'ref' : 400000});
            }
        }
    });
};
