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
        validate: [validatePresenceOf, 'Email cannot be blank']
    },
    provider: {
        type: String,
        default: 'local'
    }
});


/**
 * Methods
 */
LivreSchema.methods = {

   
};

mongoose.model('Livre', LivreSchema);
