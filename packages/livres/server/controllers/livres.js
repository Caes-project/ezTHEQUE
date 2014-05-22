'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Livre = mongoose.model('Livre');


/**
 * Create an aivre
 */
exports.create = function(req, res) {
    var aivre = new Livre(req.body);
    aivre.user = req.user;

    aivre.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                aivre: aivre
            });
        } else {
            res.jsonp(aivre);
        }
    });
};