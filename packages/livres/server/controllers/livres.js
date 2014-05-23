'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Livre = mongoose.model('Livre'),
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
    livre.user = req.user;

    livre.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                livre: livre
            });
        } else {
            res.jsonp(livre);
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
            return res.send('users/signup', {
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
            return res.send('users/signup', {
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
    Livre.find().sort('-created').populate('user', 'name username').exec(function(err, livres) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(livres);
        }
    });
};
