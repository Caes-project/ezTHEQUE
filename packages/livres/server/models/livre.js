'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return (this.prodiver && this.provider !== 'local') || value.length;
};

/**
 * User Schema
 */
var LivreSchema = new Schema({
	name: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'Name cannot be blank']
    },
    genre: {
        type: String,
        required: true,
        validate: [validatePresenceOf, 'genre cannot be blank']
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});


/**
 * Methods
 */
LivreSchema.methods = {

   
};

LivreSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};


mongoose.model('Livre', LivreSchema);
