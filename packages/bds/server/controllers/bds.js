'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Bd = mongoose.model('Bd'),
    fs = require('fs'),
    // http = require('http'),
    _ = require('lodash');


/**
 * Find bd by id
 */
exports.bd = function(req, res, next, id) {
    Bd.load(id, function(err, bd) {
        if (err) return next(err);
        if (!bd) return next(new Error('Failed to load bd ' + id));
        req.bd = bd;
        next();
    });
};

/**
 * Create a bd
 */
exports.create = function(req, res) {
    var bd = new Bd(req.body);
    bd.save(function(err) {
        if (err) {
            return res.send(400, '/bds', {
                errors: err.errors,
                bd: bd
            });
        } else {
            res.jsonp(bd);
        }
    });
};

function saveImageToServer(req, res, bd){
    var target_path = __dirname + '/../../upload/' + bd.ref + '_' +bd.code_barre+'.'+req.files.image.extension;
        //ERR 34 file doesn"t find ...
        fs.rename(req.files.image.path, target_path, function (err) {
          /*fs.writeFile(target_path, data, function (err) {*/
            if(err){
                console.log(err);
                res.send(500, 'Répertoire d\'upload indisponible');
            }else{
                // res.jsonp(bd);
                res.setHeader('Content-Type', 'text/html');
                res.status(200);
                if(req.body.create){
                    res.redirect('/#!/bds/create');
                }else{   
                    res.redirect('/#!/bds/'+ bd._id);
                }
                // res.jsonp(bd);
            }
          /*});*/
        });
}

exports.saveImage = function(req, res) {
    var bd = new Bd(req.body);
    bd.emprunt = {
                        user: null,
                        date_debut : null,
                        date_fin : null
                    };
    if(req.files.image.originalname !== null){
        bd.lien_image = '/packages/bds/upload/' + req.body.ref + '_' +req.body.code_barre+'.'+ req.files.image.extension;
    }else{
        bd.lien_image = '/packages/bds/upload/default.jpg';
    }
   bd.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(400, {
                errors: err.errors,
                bd: bd
            });
        } else {
            if(req.files.image.originalname !== null){
                saveImageToServer(req, res, bd);
            }else{
                // res.jsonp(revue);
                res.setHeader('Content-Type', 'text/html');
                res.redirect('/#!/revues/create');
            }
        }
    });     
};

exports.edit = function(req, res) {
    var bd;
    console.log('req.body');
    console.log(req.query);
    console.log(req.body);
    console.log(req.params);
    Bd.load(req.params.bdId, function(err, bd_) {
        if(err){
            console.log(err);
        }else{
            bd = bd_;
            bd = _.extend(bd, req.body);
            if(req.files.image.originalname !== null){
               bd.lien_image = '/packages/bds/upload/' + bd.ref + '_' +bd.code_barre+ '.'+req.files.image.extension;
            }
            bd.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.send(400, {
                        errors: err.errors,
                        bd: bd
                    });
                } else {
                    console.log('bd updated',bd._id);
                    // set where the file should actually exists - in this case it is in the "images" directory
                    if(req.files.image.originalname !== null){
                        saveImageToServer(req, res, bd);
                    }else{
                        res.setHeader('Content-Type', 'text/html');
                        // res.jsonp(bd);
                        res.redirect('/#!/bds/'+ bd._id);
                    }
                }
            });
        }
    });     
};

/**
 * Update an bd
 */
exports.update = function(req, res) {
    if(req.body.emprunt.user && req.bd.emprunt.user || !req.body.emprunt.user && !req.bd.emprunt.user){
        console.log('Error : le bd à déjà un emprunt');
        return res.send(400,'/', {
            errors: 'Error : le bd à déjà un emprunt'
        });
    }else{
        var bd = req.bd;

        bd = _.extend(bd, req.body);

        bd.save(function(err) {
            if (err) {
                console.log(err);
                return res.send(400,'users/signup', {
                    errors: err.errors,
                    bd: bd
                });
            } else {
                res.jsonp(bd);
            }
        });
    }
};

/**
 * Delete an bd
 */
exports.destroy = function(req, res) {
    var bd = req.bd;

    bd.remove(function(err) {
        if (err) {
            return res.send(400,'users/signup', {
                errors: err.errors,
                bd: bd
            });
        } else {
            res.jsonp(bd);
        }
    });
};

/**
 * Show an bd
 */
exports.show = function(req, res) {
    res.jsonp(req.bd);
};

/**
 * List of Bds
 */
exports.all = function(req, res) {
    if(req.query){
        Bd.find(req.query).sort({'ref':1/-1}).exec(function(err, bds) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, bds);
            }
        });
    }else{
        Bd.find().sort('-created').exec(function(err, bds) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(200, bds);
            }
        });
    }
};

exports.getMaxRef = function(req, res){
    Bd.find().sort({'ref':1/-1}).limit(-1).exec(function(err, bd){
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            if(bd[0])
                res.jsonp(200, bd[0]);
            else{
                res.jsonp(200, {'ref' : 100000});
            }
        }
    });
};
