'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Livre = mongoose.model('Livre');


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